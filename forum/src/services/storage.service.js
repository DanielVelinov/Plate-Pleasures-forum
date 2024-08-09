import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export const uploadProfilePhoto = async (uid, file) => {
    try {
        const storageRef = ref(storage, `profile_photos/${uid}/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Error uploading profile photo:', error);
                    reject(new Error('Failed to upload profile photo.'));
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error) {
        console.error('Error in uploadProfilePhoto function:', error);
        throw new Error('Failed to upload profile photo.');
    }
};
