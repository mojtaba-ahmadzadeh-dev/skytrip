export enum AuthMessages {
  // Register
  PASSWORD_MISMATCH = 'کلمه عبور و تکرار آن مطابقت ندارند',
  EMAIL_ALREADY_EXISTS = 'این ایمیل قبلاً ثبت شده است',
  USERNAME_ALREADY_EXISTS = 'این نام کاربری در دسترس نمی‌باشد',
  PHONE_ALREADY_EXISTS = 'این شماره تلفن قبلاً ثبت شده است',
  REGISTER_SUCCESS = 'ثبت‌نام با موفقیت انجام شد',
  // Login
  INVALID_CREDENTIALS = 'نام کاربری یا رمز عبور اشتباه است',
  LOGIN_SUCCESS = 'ورود با موفقیت انجام شد',
  // Token
  TOKEN_CONFIGURATION_ERROR = 'تنظیمات توکن احراز هویت انجام نشده است',
  INVALID_TOKEN = 'توکن نامعتبر یا منقضی شده است',
  TOKEN_NOT_FOUND = 'توکن احراز هویت یافت نشد',
  // Logout
  LOGOUT_SUCCESS = 'خروج از حساب کاربری با موفقیت انجام شد',
  // Forgot Password
  FORGOT_PASSWORD_SUCCESS = 'اگر این ایمیل در سیستم ثبت شده باشد، کد بازیابی ارسال خواهد شد',
  OTP_GENERATED = 'کد بازیابی رمز عبور با موفقیت ایجاد شد',
  OTP_NOT_FOUND = 'کد بازیابی یافت نشد',
  OTP_INVALID = 'کد بازیابی نامعتبر است',
  OTP_EXPIRED = 'کد بازیابی منقضی شده است',
  // Reset Password
  PASSWORD_RESET_SUCCESS = 'رمز عبور با موفقیت تغییر کرد',
}


export enum UserMessages {
  USER_NOT_FOUND = 'کاربر با آیدی مورد نظر یافت نشد',
  INVALID_ROLE = 'نقش معتبر نیست',
  ROLE_UPDATED = 'نقش کاربر با موفقیت تغییر یافت',
  USER_ALREADY_EXISTS = 'کاربری با این مشخصات قبلاً ثبت‌نام کرده است',
  USER_BANNED = 'کاربر با موفقیت مسدود شد',
  USER_UNBANNED = 'کاربر از حالت مسدود خارج شد',
  USER_DELETED = 'کاربر مورد نظر با موفقیت حذف شد',
}
