import aiohttp
from bs4 import BeautifulSoup
import logging
import urllib.parse

logger = logging.getLogger(__name__)

async def get_cas_ticket(session, username, password, service_url):
    login_url = "https://auth.mephi.ru/login"
    params = urllib.parse.urlencode({'service': service_url})
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        async with session.get(f"{login_url}?{params}", headers=headers) as response:
            response.raise_for_status()
            logger.debug(f"Получен ответ от {login_url}, статус: {response.status}")

            soup = BeautifulSoup(await response.text(), 'html.parser')
            form = soup.find('form', id='login-form')
            if not form:
                logger.error("Форма входа не найдена. Содержимое страницы:")
                logger.error((await response.text())[:1000])
                raise ValueError("Форма входа не найдена на странице авторизации")

            data = {input['name']: input.get('value', '') for input in form.find_all('input')}
            data['username'] = username
            data['password'] = password

            logger.info(f"data: {data}")

            login_action = form['action']
            if not login_action.startswith('http'):
                login_action = urllib.parse.urljoin(login_url, login_action)

            logger.info(f"Отправка данных на: {login_action}")

        async with session.post(login_action, data=data, headers=headers, allow_redirects=False) as response:
            response.raise_for_status()

            if 'Location' not in response.headers:
                logger.error("Отсутствует заголовок Location в ответе. Заголовки:")
                logger.error(response.headers)
                raise ValueError("Не удалось получить тикет: отсутствует заголовок Location")

            location = response.headers['Location']
            ticket = urllib.parse.parse_qs(urllib.parse.urlparse(location).query).get('ticket', [None])[0]
            if not ticket:
                logger.error(f"Тикет не найден в URL. Location: {location}")
                raise ValueError("Не удалось получить тикет из URL")

            logger.info("Тикет успешно получен")
            return ticket
    except aiohttp.ClientError as e:
        logger.error(f"Ошибка при отправке запроса: {e}")
        raise

async def get_student_profile(username, password):
    async with aiohttp.ClientSession() as session:
        service_url = "https://home.mephi.ru/home"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        try:
            ticket = await get_cas_ticket(session, username, password, service_url)

            async with session.get(f"{service_url}?ticket={ticket}", headers=headers, allow_redirects=True) as response:
                response.raise_for_status()
                logger.debug(f"Финальный URL после перенаправлений: {response.url}")

                soup = BeautifulSoup(await response.text(), 'html.parser')
                logger.debug(f"Заголовок страницы: {soup.title.string if soup.title else 'Не найден'}")

                name_element = soup.find('h3', class_='text-center light')
                if name_element:
                    surname = name_element.find('span', title=username)
                    if surname:
                        surname = surname.text.strip()
                        name = name_element.find('br').next_sibling.strip()
                        full_name = f"{name} {surname}"
                    else:
                        full_name = name_element.text.strip()
                else:
                    logger.error("Не удалось найти элемент с именем и фамилией")
                    full_name = "Не удалось извлечь имя и фамилию"

                group_element = soup.find('a', class_='btn btn-primary btn-outline', href=lambda x: x and x.startswith('/study_groups/'))
                if group_element:
                    group = group_element.text.strip()
                else:
                    logger.error("Не удалось найти элемент с номером группы")
                    group = "Не удалось извлечь номер группы"

                logger.info(f"Успешно получен профиль студента: {full_name}, группа: {group}")
                return {'full_name': full_name, 'group': group.split(".")[0]}
        except Exception as e:
            logger.error(f"Ошибка при получении профиля студента: {e}")
            raise
