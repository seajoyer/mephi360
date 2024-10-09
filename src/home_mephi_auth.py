import requests
import urllib.parse
from bs4 import BeautifulSoup
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def get_cas_ticket(session, username, password, service_url):
    login_url = "https://auth.mephi.ru/login"
    params = urllib.parse.urlencode({'service': service_url})
    try:
        response = session.get(f"{login_url}?{params}")
        response.raise_for_status()
        logging.debug(f"Получен ответ от {login_url}, статус: {response.status_code}")

        soup = BeautifulSoup(response.text, 'html.parser')
        form = soup.find('form', id='login-form')
        if not form:
            logging.error("Форма входа не найдена. Содержимое страницы:")
            logging.error(response.text[:1000])
            raise ValueError("Форма входа не найдена на странице авторизации")

        data = {input['name']: input.get('value', '') for input in form.find_all('input')}
        data['username'] = username
        data['password'] = password

        login_action = form.get('action')
        if not login_action.startswith('http'):
            login_action = urllib.parse.urljoin(login_url, login_action)

        response = session.post(login_action, data=data, allow_redirects=False)
        response.raise_for_status()

        if 'Location' not in response.headers:
            logging.error("Отсутствует заголовок Location в ответе. Заголовки:")
            logging.error(response.headers)
            raise ValueError("Не удалось получить тикет: отсутствует заголовок Location")

        location = response.headers['Location']
        ticket = urllib.parse.parse_qs(urllib.parse.urlparse(location).query).get('ticket', [None])[0]
        if not ticket:
            logging.error(f"Тикет не найден в URL. Location: {location}")
            raise ValueError("Не удалось получить тикет из URL")

        return ticket
    except requests.RequestException as e:
        logging.error(f"Ошибка при отправке запроса: {e}")
        raise

def get_student_profile(username, password):
    session = requests.Session()
    service_url = "https://home.mephi.ru/home"

    try:
        ticket = get_cas_ticket(session, username, password, service_url)

        # Переходим по URL с тикетом
        response = session.get(f"{service_url}?ticket={ticket}", allow_redirects=True)
        response.raise_for_status()
        logging.debug(f"Финальный URL после перенаправлений: {response.url}")

        soup = BeautifulSoup(response.text, 'html.parser')
        logging.debug(f"Заголовок страницы: {soup.title.string if soup.title else 'Не найден'}")

        # Находим элемент h3 с классом "text-center light"
        name_element = soup.find('h3', class_='text-center light')
        if name_element:
            surname = name_element.find('span', title=username).text.strip()
            name = name_element.find('br').next_sibling.strip()
            full_name = f"{name} {surname}"
        else:
            logging.error("Не удалось найти элемент с именем и фамилией")
            full_name = "Не удалось извлечь имя и фамилию"

        # Extract study group number
        group_element = soup.find('a', class_='btn btn-primary btn-outline', href=lambda x: x and x.startswith('/study_groups/'))
        if group_element:
            group = group_element.text.strip()
        else:
            logging.error("Не удалось найти элемент с номером группы")
            group = "Не удалось извлечь номер группы"

        return {'full_name': full_name, 'group': group.split(".")[0]}
    except Exception as e:
        logging.error(f"Ошибка при получении профиля студента: {e}")
        raise

if __name__ == "__main__":
    username = "sd015"
    password = "hGFd%8gn"
    try:
        profile_data = get_student_profile(username, password)
        print(f"Полное имя: {profile_data['full_name']}")
        print(f"Учебная группа: {profile_data['group']}")
    except Exception as e:
        print(f"Произошла ошибка: {e}")
        logging.error("Полный стек ошибки:", exc_info=True)
