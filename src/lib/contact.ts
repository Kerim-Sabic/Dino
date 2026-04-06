export function buildWhatsAppLink(phoneNumber: string, message: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

interface EmailComposeOptions {
  to: string;
  subject?: string;
  body?: string;
}

function buildQueryString(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  return searchParams.toString();
}

export function buildMailtoLink({ to, subject, body }: EmailComposeOptions) {
  const query = buildQueryString({ subject, body });
  return `mailto:${encodeURIComponent(to)}${query ? `?${query}` : ""}`;
}

export function buildGmailComposeLink({ to, subject, body }: EmailComposeOptions) {
  const query = buildQueryString({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${query}`;
}

function buildIosGmailComposeLink({ to, subject, body }: EmailComposeOptions) {
  const query = buildQueryString({ to, subject, body });
  return `googlegmail:///co?${query}`;
}

function buildAndroidGmailComposeLink({ to, subject, body }: EmailComposeOptions) {
  const query = buildQueryString({ to, subject, body });
  return `intent://co?${query}#Intent;scheme=googlegmail;package=com.google.android.gm;end`;
}

export function openEmailComposer(options: EmailComposeOptions) {
  if (typeof window === "undefined") {
    return;
  }

  const gmailWebUrl = buildGmailComposeLink(options);
  const mailtoUrl = buildMailtoLink(options);
  const userAgent = window.navigator.userAgent || "";
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  if (!isAndroid && !isIOS) {
    const popup = window.open(gmailWebUrl, "_blank", "noopener,noreferrer");

    if (!popup) {
      window.location.href = mailtoUrl;
    }

    return;
  }

  let appOpened = false;
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      appOpened = true;
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.location.href = isAndroid
    ? buildAndroidGmailComposeLink(options)
    : buildIosGmailComposeLink(options);

  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);

    if (!appOpened) {
      window.location.href = gmailWebUrl;
    }
  }, 900);
}
