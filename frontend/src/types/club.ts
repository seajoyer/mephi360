// Define the club data structure
export interface ClubContactInfo {
    email?: string;
    telegramLink?: string;
}

export interface Club {
    id: number;
    link: string,
    name: string;
    description: string;
    organizer: string;
    memberCount: number;
    imageFileName: string;
    contactInfo?: ClubContactInfo;
    meetingSchedule?: string;
    location?: string;
    type?: string;
}
