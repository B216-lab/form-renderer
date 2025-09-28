export const devlog = (message: any) => {
  if (import.meta.env.VITE_ENV === "development") {
    console.log(message);
  }
};