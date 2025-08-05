export const toast = {
  success: (message: string) => {
    console.log('Success:', message);
    // For now, just console log. We can implement proper toast later
    alert(message);
  },
  error: (message: string) => {
    console.error('Error:', message);
    alert(message);
  },
  info: (message: string) => {
    console.info('Info:', message);
    alert(message);
  }
};
