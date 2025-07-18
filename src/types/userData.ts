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
  resetUserState: () => void; // ✅ 이 부분이 필수!
}

export const defaultUserInfo = {
  isState: false,
  sns_id: null,
  email: null,
  profileImage:  null,
  agreement: false,
  registDate:  null,
  unregistDate:  null,
  updatedDate:  null,
  userId:  null,
  isGuest: true,
  joinType:  null,
  nickName:  null,
  userMaxToken: 0,
  userRetryLimitSec: 0
}