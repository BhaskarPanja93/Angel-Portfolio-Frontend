import {useState} from "react";
import {UseAuthContext} from "../../../context/AuthService";
import {UseDefaultNotification} from "../../../context/DefaultNotificationService";
import {ROUTES} from "../../../context/Constants";
import {UseDataFetcherContext} from "../../../context/DataFetcher";

export default function NewCategoryPopup({closePopup}) {
    const [disabledOperation, setDisabledOperation] = useState(false)

    const [progress, setProgress] = useState(0);

    const [name, setName] = useState('');
    const [priority, setPriority] = useState("0");
    const [thumbnail, setThumbnail] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    const {connection} = UseAuthContext()
    const {newNotification} = UseDefaultNotification()
    const {fetchCatExtData} = UseDataFetcherContext()

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    }

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!name) return newNotification("Please enter name")
        if (!thumbnail) return newNotification("Please choose thumbnail")
        setDisabledOperation(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('priority', priority)
        formData.append('thumbnail', thumbnail)
        try {
            await connection.post(ROUTES.CREATE_CATEGORY, formData, {
                onUploadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            })
            fetchCatExtData(true).then()
            closePopup()
        } catch (error) {
            newNotification('New Category error:', error?.message)
        } finally {
            setProgress(0);
            setDisabledOperation(false)
        }
    }


    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
        <div
            className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center shadow-gray-800 shadow-xl border border-gray-200 gap-4"
            style={{width: "95%", maxWidth: "500px", maxHeight: "98vh", overflowY: "auto"}}>

            <button
                    className="absolute right-6 mb-2 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg"
                    onClick={closePopup}>X
            </button>

            <h2 className="text-xl font-semibold text-center">Add New Category</h2>

            <div className="w-full flex flex-col gap-4 items-center p-4">

                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                    <input type="text"
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                           onChange={handleNameChange}
                           value={name}
                           disabled={disabledOperation}
                           onBlur={(e) => {
                               const value = e.target.value;
                               const isValid = value !== "" && value.length < 30;
                               e.target.setCustomValidity(isValid ? "" : "Name too long");
                               e.target.classList.toggle("border-4", !isValid);
                               e.target.classList.toggle("border-red-500", !isValid);
                           }}
                    />
                </div>

                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Priority</label>
                    <input type="number"
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                           onChange={handlePriorityChange}
                           value={priority}
                           disabled={disabledOperation}
                    />
                </div>

                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Upload Thumbnail</label>

                    <input type="file" accept="image/*" className="w-full mb-2"
                           onChange={handleThumbnailChange}
                           disabled={disabledOperation}
                    />
                    {previewURL && <img src={previewURL} alt="Thumbnail"
                                        className="w-20 h-20 object-cover rounded-lg border-2 "/>}

                </div>

                <div className="w-full mt-auto">
                    <div className="h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <div className="h-full bg-blue-500 w-0 transition-all duration-300" style={{width: `${progress}%`}}></div>
                    </div>
                </div>

                <button type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full"
                        onClick={handleSubmit}
                        disabled={disabledOperation}
                >
                    Create
                </button>
            </div>

        </div>
    </div>)
}