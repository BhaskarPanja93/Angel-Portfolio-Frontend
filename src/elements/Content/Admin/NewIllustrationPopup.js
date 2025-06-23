import {Link, useParams} from "react-router-dom";
import {useState} from "react";
import {UseAuthContext} from "../../../context/AuthService";
import {UseDefaultNotification} from "../../../context/DefaultNotificationService";
import {ROUTES} from "../../../context/Constants";

import LeftTriangle from "../../../static/left_triangle.png"
import RightTriangle from "../../../static/right_triangle.png"
import YTLogo from "../../../static/youtube_logo.png"
import RobloxLogo from "../../../static/roblox_logo.png"
import {UseDataFetcherContext} from "../../../context/DataFetcher";

export default function NewIllustrationPopup({closePopup}) {
    const {'*': rest} = useParams();
    const segments = rest?.split('/') || [];
    const openedCategoryID = segments[0] || null;

    const [disabledOperation, setDisabledOperation] = useState(false)

    const [progress, setProgress] = useState(0);

    const [name, setName] = useState('');
    const [priority, setPriority] = useState("0");
    const [imageList, setImageList] = useState([]);
    const [imagePreviewURLList, setImagePreviewURLList] = useState([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(0);
    const [gif, setGif] = useState(null);
    const [gifPreviewURL, setGifPreviewURL] = useState(null);
    const [description, setDescription] = useState("");
    const [yt, setYt] = useState("");
    const [roblox, setRoblox] = useState("");


    const {connection} = UseAuthContext()
    const {newNotification} = UseDefaultNotification()
    const {fetchCatIntData} = UseDataFetcherContext()

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleYtChange = (e) => {
        setYt(e.target.value);
    }

    const handleRobloxChange = (e) => {
        setRoblox(e.target.value);
    }
    const handleGifChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setGif(file);
            setGifPreviewURL(URL.createObjectURL(file))
        }
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageList(files);
        const previewURLs = files.map(file => URL.createObjectURL(file));
        setImagePreviewURLList(previewURLs);
    };


    const handleImageShift = (index, shift) => {
        const newIndex = index + shift;
        if (newIndex < 0 || newIndex >= imageList.length) return;
        const newImageList = [...imageList];
        const newPreviewList = [...imagePreviewURLList];
        [newImageList[index], newImageList[newIndex]] = [newImageList[newIndex], newImageList[index]];
        [newPreviewList[index], newPreviewList[newIndex]] = [newPreviewList[newIndex], newPreviewList[index]];
        setImageList(newImageList);
        setImagePreviewURLList(newPreviewList);
    };

    const handleSubmit = async () => {
        if (!name) return newNotification("Please enter name");
        if (imageList.length === 0) return newNotification("Please choose images");
        setDisabledOperation(true)
        const formData = new FormData();
        formData.append('category_id', openedCategoryID);
        formData.append('name', name);
        formData.append('priority', priority);
        formData.append('thumbnail', thumbnailIndex);
        imageList.forEach(file => {
            formData.append('images', file);
        });
        if (gif) formData.append('gif', gif);
        if (description) formData.append('description', description);
        if (yt) formData.append('yt', yt);
        if (roblox) formData.append('roblox', roblox);
        try {
            await connection.post(ROUTES.CREATE_ILLUSTRATION, formData, {
                onUploadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            })
            fetchCatIntData(openedCategoryID, true).then()
            closePopup()
        } catch (error) {
            newNotification('New Illustration error:', error);
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
                onClick={closePopup}
            >X
            </button>

            <h2 className="text-xl font-semibold text-center">Add New Illustration</h2>

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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                    <textarea rows="1"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
                              onChange={handleDescriptionChange}
                              value={description}
                              disabled={disabledOperation}
                              onBlur={(e) => {
                                  const value = e.target.value;
                                  const isValid = value === "" || value.length < 100;
                                  e.target.setCustomValidity(isValid ? "" : "Desc too long");
                                  e.target.classList.toggle("border-4", !isValid);
                                  e.target.classList.toggle("border-red-500", !isValid);
                              }}
                    />
                </div>

                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Roblox URL </label>

                    <div className="flex items-center gap-2">
                        <input type="text"
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                               onChange={handleRobloxChange}
                               value={roblox}
                               disabled={disabledOperation}
                               onBlur={(e) => {
                                   const value = e.target.value;
                                   const isValid = value === "" || value.includes("roblox.com");
                                   e.target.setCustomValidity(isValid ? "" : "Not a valid Roblox URL");
                                   e.target.classList.toggle("border-4", !isValid);
                                   e.target.classList.toggle("border-red-500", !isValid);
                               }}
                        />
                        {roblox && <Link to={roblox} target={"_blank"}><img src={RobloxLogo} alt={"Roblox"}/></Link>}
                    </div>
                </div>

                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Youtube URL </label>
                    <div className="flex items-center gap-2">
                        <input type="text"
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                               onChange={handleYtChange}
                               value={yt}
                               disabled={disabledOperation}
                               onBlur={(e) => {
                                   const value = e.target.value;
                                   const isValid = value === "" || value.includes("be.com");
                                   e.target.setCustomValidity(isValid ? "" : "Not a valid Youtube URL");
                                   e.target.classList.toggle("border-4", !isValid);
                                   e.target.classList.toggle("border-red-500", !isValid);
                               }}
                        />
                        {yt && <Link to={yt} target={"_blank"}><img src={YTLogo} alt={"YT"}/></Link>}
                    </div>

                </div>

                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Upload 3D GIF</label>

                    <input type="file" accept="image/*" className="w-full mb-2"
                           onChange={handleGifChange}
                           disabled={disabledOperation}
                    />
                    {gifPreviewURL && <img src={gifPreviewURL} alt="Preview"
                                           className="w-20 h-20 object-cover rounded-lg border "/>}

                </div>


                <div className="w-full">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Upload Images</label>
                    <input type="file" accept="image/*" className="w-full mb-2"
                           onChange={handleImageChange}
                           multiple={true}
                           disabled={disabledOperation}
                    />
                    {imagePreviewURLList.length > 0 && (
                        <div  className="w-full grid grid-cols-4 gap-2">
                            {imagePreviewURLList.map((imageURL, index) => (

                                <div key={index}
                                     className={`flex flex-col items-center ${index === thumbnailIndex ? "border-2 border-yellow-400" : "border-2"}`}>
                                    <img
                                        key={index}
                                        src={imageURL}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg"
                                        onClick={() => setThumbnailIndex(index)}
                                    />
                                    <div className="flex flex-row justify-center gap-1 mt-1">
                                        {index !== 0 && <img
                                            src={LeftTriangle}
                                            onClick={() => handleImageShift(index, -1)}
                                            alt="Up"
                                            className="w-5 h-5 object-cover rounded"
                                        />}
                                        {index !== imagePreviewURLList.length - 1 && <img
                                            src={RightTriangle}
                                            onClick={() => handleImageShift(index, +1)}
                                            alt="Down"
                                            className="w-5 h-5 object-cover rounded"
                                        />}
                                    </div>
                                </div>

                            ))}
                        </div>)}
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