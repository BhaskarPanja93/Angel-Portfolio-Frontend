import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {UseAuthContext} from "../../../context/AuthService";
import {UseDefaultNotification} from "../../../context/DefaultNotificationService";
import {ROUTES} from "../../../context/Constants";
import {UseDataFetcherContext} from "../../../context/DataFetcher";


export default function ModifyCategoryPopup({closePopup}) {
    const {'*': rest} = useParams();
    const segments = rest?.split('/') || [];
    const openedCategoryID = segments[0] || null;

    const [disabledOperation, setDisabledOperation] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [progress, setProgress] = useState(0);

    const [key, setKey] = useState(null);
    const [name, setName] = useState('');
    const [priority, setPriority] = useState("0");
    const [thumbnail, setThumbnail] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [verify, setVerify] = useState("");

    const {connection} = UseAuthContext()
    const {newNotification} = UseDefaultNotification()
    const {fetchCatExtData, catExtData} = UseDataFetcherContext()
    const navigate = useNavigate();

    useEffect(() => {
        fetchCatExtData().then()
    }, []);


    useEffect(() => {
        setLoaded(false)
        if (catExtData.individual && catExtData.individual[openedCategoryID]) {
            setPriority(catExtData.individual[openedCategoryID].priority)
            setName(catExtData.individual[openedCategoryID].name)
            setName(catExtData.individual[openedCategoryID].name)
            setLoaded(true);
        }
    }, [catExtData, key]);


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
    }

    const handleVerifyChange = (e) => {
        setVerify(e.target.value);
    }

    const handleSubmit = async () => {
        setDisabledOperation(true)
        const formData = new FormData();
        formData.append('key', key)
        formData.append('category_id', openedCategoryID)
        if (key === "name") {
            if (name) formData.append('name', name); else return newNotification('Please enter name');
        }
        if (key === "delete") {
            if (verify) formData.append('verify', verify); else return newNotification('Please enter name to verify');
        }
        if (key === "priority") {
            if (priority) formData.append('priority', priority); else return newNotification('Please enter priority');
        }
        if (key === "thumbnail") {
            if (thumbnail) formData.append('thumbnail', thumbnail); else return newNotification('Please choose thumbnail');
        }
        try {
            await connection.post(ROUTES.MODIFY_CATEGORY, formData, {
                onUploadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            })
        } catch (error) {
            newNotification('Modify Category error', error?.message);
        } finally {
            setProgress(0);
            setDisabledOperation(false)
            fetchCatExtData(openedCategoryID, true).then()
            closePopup()
            navigate(`/gallery`, {replace: true})
        }
    }


    return loaded && openedCategoryID ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div
                className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center shadow-gray-800 shadow-xl border border-gray-200 gap-4"
                style={{width: "95%", maxWidth: "500px", maxHeight: "98vh", overflowY: "auto"}}>

                <button
                        className="absolute right-6 mb-2 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg"
                        onClick={closePopup}>X
                </button>

                <h2 className="text-xl font-semibold text-center">Modify Category</h2>
                <select
                    className="block w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setKey(e.target.value)}
                    value={key}
                    disabled={disabledOperation}
                >
                    <option value={null}>Select...</option>
                    <option value="name">Name</option>
                    <option value="priority">Priority</option>
                    <option value="thumbnail">Thumbnail</option>
                    <option value="delete">Delete</option>
                </select>

                {key === "name" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                        <input type="text"
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                               value={name}
                               onChange={handleNameChange}
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
                </div>) : key === "priority" ? (<div className="w-full flex flex-col gap-4 items-center p-4">


                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Priority</label>
                        <input type="number"
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                               onChange={handlePriorityChange}
                               value={priority}
                               disabled={disabledOperation}
                        />
                    </div>
                </div>) : key === "thumbnail" ? (<div className="w-full flex flex-col gap-4 items-center p-4">


                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Upload
                            Thumbnail</label>

                        <input type="file" accept="image/*"
                               className="w-full mb-2"
                               onChange={handleThumbnailChange}
                               disabled={disabledOperation}/>
                        {previewURL && <img src={previewURL} alt="Thumbnail"
                                            className="w-20 h-20 object-cover rounded-lg border-2 "/>}

                    </div>
                </div>) : key === "delete" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Enter
                            "{name}" to confirm
                            delete:
                        </label>
                        <input type="text"
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                               onChange={handleVerifyChange}
                               disabled={disabledOperation}
                               onBlur={(e) => {
                                   const value = e.target.value;
                                   const isValid = value === "" || value === name;
                                   e.target.setCustomValidity(isValid ? "" : "Verify string invalid");
                                   e.target.classList.toggle("border-4", !isValid);
                                   e.target.classList.toggle("border-red-500", !isValid);
                               }}
                        />
                    </div>

                </div>) : null}

                <div className="w-full mt-auto">
                    <div className="h-3 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="h-full bg-blue-500 w-0 transition-all duration-300" style={{width: `${progress}%`}}></div>
                    </div>
                </div>

                {key ? <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                    onClick={handleSubmit}
                    disabled={disabledOperation}
                >
                    Continue
                </button> : null}

            </div>
        </div>) : null
}