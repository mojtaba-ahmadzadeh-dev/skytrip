export enum AuthMessages {
  INVALID_EMAIL = "فرمت ایمیل نامعتبر است",
  INVALID_MOBILE = "فرمت شماره موبایل نامعتبر است",
  USER_NOT_FOUND = "کاربر یافت نشد",
  OTP_NOT_FOUND = "کد تایید یافت نشد",
  OTP_EXPIRED = "کد تایید منقضی شده است",
  OTP_INVALID = "کد تایید نامعتبر است",
  LOGIN_SUCCESSFUL = "ورود با موفقیت انجام شد",
  OTP_SENT_SUCCESSFULLY = "کد با موفقیت ارسال شد",
  OTP_COOLDOWN = "تا ۲ دقیقه دیگر امکان دریافت کد جدید ندارید",
  INVALID_OTP = "فرمت کد تایید نامعتبر است",
  BOTH_EMAIL_OR_MOBILE_REQUIRED = "لطفا یک ایمیل یا شماره موبایل وارد کنید",
}

export enum UserMessages {
  USER_NOT_FOUND = "کاربر با آیدی مورد نظر یافت نشد",
  INVALID_ROLE = "نقش معتبر نیست",
  ROLE_UPDATED = "نقش کاربر با موفقیت تغییر یافت",
  USER_ALREADY_EXISTS = "کاربری با این مشخصات قبلاً ثبت‌نام کرده است",
  USER_BANNED = "کاربر با موفقیت مسدود شد",
  USER_UNBANNED = "کاربر از حالت مسدود خارج شد",
  USER_DELETED = "کاربر مورد نظر با موفقیت حذف شد",
}