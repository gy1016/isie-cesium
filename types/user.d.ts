export interface IUserInfo {
  id: number; // 用户唯一标识
  username: string;
  password: string;
  role: string;
  createTime: string | undefined;
  updateTime: string | undefined;
  avatar?: string; // 用户头像base64或者url
}
