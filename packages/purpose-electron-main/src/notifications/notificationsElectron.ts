// Sadly, no onclick on Ubuntu
import {Notification} from 'electron';
export function showNotification() {
  const myNotification = new Notification({
    title: 'Title',
    body: 'Lorem Ipsum Dolor Sit Amet'
  });

  console.log(myNotification);

  myNotification.addListener('click', () => {
    console.log('Notification clicked');
  });
}
