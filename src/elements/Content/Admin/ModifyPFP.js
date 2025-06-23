import {useState} from "react";
import {ROUTES} from "../../../context/Constants";
import {UseAuthContext} from "../../../context/AuthService";
import {UseDefaultNotification} from "../../../context/DefaultNotificationService";

export default function ModifyPFP({closePopup}) {
    const [disabledOperation, setDisabledOperation] = useState(false)

    const [image, setImage] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    const {connection} = UseAuthContext()
    const {newNotification} = UseDefaultNotification()


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async () => {
        setDisabledOperation(true)
        const formData = new FormData();
        formData.append('new_file', image);
        try {
            await connection.post(ROUTES.MODIFY_PFP, formData);
            newNotification('Success');
        } catch (error) {
            newNotification('Modify PFP error:', error);
        } finally {
            setDisabledOperation(false)
        }
    }


    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div
                className="bg-white w-[90%] max-w-[400px] h-auto p-6 rounded-lg shadow-lg relative flex flex-col items-center shadow-gray-800 shadow-xl border border-gray-200">

                <button
                        className="self-end mb-4 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg"
                        onClick={closePopup}>X
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">Upload PFP</h2>


                <input type="file" accept="image/*" className="w-full mb-2"
                       onChange={handleImageChange}
                       disabled={disabledOperation}
                />
                {previewURL && <img src={previewURL} alt="Thumbnail"
                                    className="w-20 h-20 object-cover rounded-lg border "/>}
                <button type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full"
                        onClick={handleSubmit}
                        disabled={disabledOperation}
                >
                    Create
                </button>

            </div>
        </div>)
}