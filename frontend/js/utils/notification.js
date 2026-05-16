const notification = {
  show(message, type = "success") {
    // Ekranda zaten bir bildirim varsa temizle
    const oldAlert = document.getElementById("main-notification");
    if (oldAlert) oldAlert.remove();

    const alertDiv = document.createElement("div");
    alertDiv.id = "main-notification";
    alertDiv.className = `notification-box ${type}`;
    alertDiv.innerText = message;

    // Sayfanın en üstüne ekle
    document.body.appendChild(alertDiv);

    // 3 saniye sonra otomatik silinsin
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  },
};

window.notification = notification;
