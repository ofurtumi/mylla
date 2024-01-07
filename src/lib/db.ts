import type { GAME, DB_RESPONSE } from './types';
import { database } from './firebase/firebase.app';
import { collection, doc, setDoc, getDoc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { new_game } from './utils';

const game_ref = collection(database, 'games');

export const get_game = async (id: string): Promise<DB_RESPONSE> => {
	try {
		const doc_snap = await getDoc(doc(game_ref, id));
		if (doc_snap.exists()) {
			return {
				id,
				game: doc_snap.data() as GAME,
				success: true
			};
		} else {
			return {
				success: false,
				error: 'No such document!'
			};
		}
	} catch (e) {
		console.error(`Failed to get game ${id} - error: ${e}`);
		return { success: false, error: e as string };
	}
};

export const create_game = async (game: GAME): Promise<DB_RESPONSE> => {
	try {
		const new_doc = await addDoc(collection(database, 'games'), game);

		return {
			id: new_doc.id,
			game,
			success: true
		};
	} catch (e) {
		console.error(`Failed to create game - error: ${e}`);
		return { success: false, error: e as string };
	}
};

export const set_game = async (game: GAME, id: string): Promise<DB_RESPONSE> => {
	try {
		await setDoc(doc(game_ref, id), {
			state: game.state,
			available: game.available,
			move: game.move,
			score_o: game.score_o,
			score_x: game.score_x,
			user_x: game.user_x,
			user_o: game.user_o
		});

		return {
			id,
			game,
			success: true
		};
	} catch (e) {
		console.error(`Failed to update game ${id} - error: ${e}`);
		return { success: false, error: e as string };
	}
};

export const unsub = (id: string, func: (game: DB_RESPONSE) => void) =>
	onSnapshot(doc(database, 'games', id), (doc) => {
		func({ success: true, game: doc.data() as GAME, id: doc.id });
	});

export const add_o_user = async (id: string, user_o: string): Promise<DB_RESPONSE> => {
	try {
		const game_ref = doc(database, 'games', id);
		await updateDoc(game_ref, { user_o });
		return {
			id,
			success: true
		};
	} catch (e) {
		console.error(`Failed to update game ${id} - error: ${e}`);
		return { success: false, error: e as string };
	}
};

export const reset_game = async (id: string): Promise<void> => {
	try {
		const game_ref = doc(database, 'games', id);

		await updateDoc(game_ref, {
			available: '012345678',
			state: new Array(81).fill('e').join('')
		});
	} catch (error) {
		throw new Error(`Failed to reset game ${id} - error: ${error}`);
	}
};
