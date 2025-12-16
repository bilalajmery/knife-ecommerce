import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#111827",
  color: "#fff",
  customClass: {
    popup: "border border-gray-800 rounded-xl shadow-xl",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const showAlert = (type, title, text, confirmButtonText = "OK") => {
  return Swal.fire({
    icon: type,
    title: title,
    text: text,
    background: "#0a0a0a",
    color: "#fff",
    confirmButtonColor: "#DC2626",
    cancelButtonColor: "#374151",
    confirmButtonText: confirmButtonText,
    customClass: {
      popup: "border border-gray-900 rounded-2xl shadow-2xl",
      title: "text-xl font-bold tracking-tight",
      htmlContainer: "text-gray-400",
      confirmButton:
        "px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm shadow-lg shadow-primary/20",
      cancelButton:
        "px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-gray-800",
    },
    buttonsStyling: false,
    showClass: {
      popup: "animate__animated animate__fadeInUp animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown animate__faster",
    },
  });
};

const showConfirm = (title, text, confirmButtonText = "Yes, do it!") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DC2626",
    cancelButtonColor: "#374151",
    confirmButtonText: confirmButtonText,
    background: "#0a0a0a",
    color: "#fff",
    customClass: {
      popup: "border border-gray-900 rounded-2xl shadow-2xl",
      title: "text-xl font-bold tracking-tight",
      htmlContainer: "text-gray-400",
      confirmButton:
        "px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm shadow-lg shadow-primary/20 bg-primary text-white mr-3",
      cancelButton:
        "px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm bg-gray-800 text-gray-300 hover:bg-gray-700",
    },
    buttonsStyling: false,
  });
};

export { Toast, showAlert, showConfirm };
