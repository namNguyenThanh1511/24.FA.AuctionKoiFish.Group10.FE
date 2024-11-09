const requestPermissions = async () => {
  //request permission of current user to give notification from web app
  //Browser will pop-up the request permission for user to allow give notification or not
  await Notification.requestPermission();
};
export default requestPermissions;
