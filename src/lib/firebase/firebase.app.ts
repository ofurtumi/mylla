import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBAu5_Zl8IJj4PJbobAM9AujHaElnGlIhw',
	authDomain: 'ofurmylla.firebaseapp.com',
	projectId: 'ofurmylla',
	storageBucket: 'ofurmylla.appspot.com',
	messagingSenderId: '31626392548',
	appId: '1:31626392548:web:f0c3ce4dccdcfe4a554df1',
	measurementId: 'G-PHWKKDE8KM'
};

const firebaseApp = initializeApp(firebaseConfig);
export const database = getFirestore(firebaseApp);
