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

export enum RbacMessages {
  ROLE_NOT_FOUND = 'نقش مورد نظر پیدا نشد',
  PERMISSION_NOT_FOUND = 'دسترسی مورد نظر پیدا نشد',
  PERMISSION_ALREADY_ASSIGNED = 'این دسترسی قبلاً به نقش مورد نظر اختصاص داده شده است',
  PERMISSION_ASSIGNED_SUCCESSFULLY = 'دسترسی با موفقیت به نقش اختصاص داده شد',
  PERMISSION_REMOVED_SUCCESSFULLY = 'دسترسی با موفقیت از نقش حذف شد',
  ROLE_CREATED_SUCCESSFULLY = 'نقش جدید با موفقیت ساخته شد',
  ROLE_UPDATED_SUCCESSFULLY = 'نقش با موفقیت به‌روزرسانی شد',
  ROLE_DELETED_SUCCESSFULLY = 'نقش با موفقیت حذف شد',
  ACCESS_DENIED = 'شما دسترسی لازم برای این عملیات را ندارید',
  ALREADY_PERMISSION = 'این دسترسی قبلا به نقش مورد نظر اختصاص داده شده است',
  NOTFOUND_ROLE = 'نقش مورد نظر یافت نشد',
  NOTFOUND_PERMISSION = 'دسترسی مورد نظر یافت نشد',
  PERMISSION_ALREADY_EXISTS = 'این دسترسی قبلاً وجود دارد',
  UNAUTHORIZED = 'لطفا ابتدا وارد شوید',
  INVALID_TOKEN = 'توکن نامعتبر یا منقضی شده است',
  INVALID_TOKEN_PAYLOAD = 'اطلاعات توکن نامعتبر است',
  USER_NOT_FOUND = 'کاربر یافت نشد',
  FORBIDDEN = 'شما دسترسی به این عملیات ندارید',
}