export interface UserData {
    isState: boolean;
    sns_id: string;
    email: string;
    profileImage: string;
    agreement: boolean;
    registDate: string;
    unregistDate: string;
    updatedDate: string;
    userId: string;
    isGuest: boolean;
    joinType: string;
    nickName: string;
    userMaxToken: number;
    userRetryLimitSec: number;
    setUserState: (data: Partial<Omit<UserData, 'setUserState'>>) => void;
  }