import { Human } from './Human';
export interface HumanAdd extends Human {
    bio: string;
    email: string;
    phoneNumber: string;
}
