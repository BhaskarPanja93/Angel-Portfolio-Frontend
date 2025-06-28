import {Link, useLocation} from "react-router-dom";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {UseDataFetcherContext} from "../../../context/DataFetcher";
import {ROUTES} from "../../../context/Constants";
import RobloxLogo from "../../../static/roblox_logo.png";
import YTLogo from "../../../static/youtube_logo.png";
import LeftTriangle from "../../../static/left_triangle.png";
import RightTriangle from "../../../static/right_triangle.png";
import {UseDefaultNotification} from "../../../context/DefaultNotificationService";
import {UseAuthContext} from "../../../context/AuthService";
import PrevTriangle from "../../../static/left_triangle.png";
import NextTriangle from "../../../static/right_triangle.png";

export default function ModifyIllustrationPopup({categoryID, illustrationID}) {
    const [disabledOperation, setDisabledOperation] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [imageIndex, setImageIndex] = useState(0)
    const [showingGIF, setShowingGIF] = useState(false)

    const [progress, setProgress] = useState(0);


    const [key, setKey] = useState(null);
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
    const [verify, setVerify] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const {fetchCatIntData, catIntData, fetchIllusIntData, illusIntData} = UseDataFetcherContext()
    const {newNotification} = UseDefaultNotification()
    const {connection} = UseAuthContext()

    useEffect(() => {
        fetchCatIntData().then()
        fetchIllusIntData().then()
    }, []);


    useEffect(() => {
        setLoaded(false)
        if (catIntData && catIntData[categoryID] && catIntData[categoryID].individual[illustrationID] && illusIntData && illusIntData[categoryID] && illusIntData[categoryID][illustrationID]) {
            setName(illusIntData[categoryID][illustrationID].name)
            setDescription(illusIntData[categoryID][illustrationID].description)
            setGifPreviewURL(`/portfolio/dynamic/${categoryID}/${illustrationID}/${illusIntData[categoryID][illustrationID].gif}`)
            setImagePreviewURLList(illusIntData[categoryID][illustrationID].images.map(str => `/portfolio/dynamic/${categoryID}/${illustrationID}/${str}`))
            setPriority(catIntData[categoryID].individual[illustrationID].priority)
            setThumbnailIndex(illusIntData[categoryID][illustrationID].images.indexOf(catIntData[categoryID].individual[illustrationID].thumbnail))
            setYt(catIntData[categoryID].individual[illustrationID].yt)
            setRoblox(catIntData[categoryID].individual[illustrationID].roblox)
            setLoaded(true);
        }
    }, [catIntData, illusIntData, key]);


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


    const handleVerifyChange = (e) => {
        setVerify(e.target.value);
    }


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
        setDisabledOperation(true)
        const formData = new FormData();
        formData.append('key', key)
        formData.append('category_id', categoryID)
        formData.append('illustration_id', illustrationID)
        if (key === "name") {
            if (name) formData.append('name', name); else return newNotification('Please enter name');
        }
        if (key === "delete") {
            if (verify) formData.append('verify', verify); else return newNotification('Please enter name to verify');
        }
        if (key === "priority") {
            if (priority) formData.append('priority', priority); else return newNotification('Please enter priority');
        }
        if (key === "gif") {
            if (priority) formData.append('gif', gif); else return newNotification('Please enter gif');
        }
        if (key === "description") {
            if (priority) formData.append('description', description); else return newNotification('Please enter description');
        }
        if (key === "yt") {
            if (priority) formData.append('yt', yt); else return newNotification('Please enter yt URL');
        }
        if (key === "roblox") {
            if (priority) formData.append('roblox', roblox); else return newNotification('Please enter roblox URL');
        }
        if (key === "thumbnail") {
            formData.append('thumbnail', thumbnailIndex);
        }
        if (key === "image") {
            formData.append('thubmnail', thumbnailIndex)
            if (imageList.length > 0) {
                imageList.forEach(file => {
                    formData.append('images', file);
                })
            } else return newNotification('Please choose images');
        }
        try {
            await connection.post(ROUTES.MODIFY_ILLUSTRATION, formData, {
                onUploadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                }
            })
        } catch (error) {
            newNotification('Modify Illustration error:', error?.message);
        } finally {
            setProgress(0);
            fetchCatIntData(categoryID, true).then()
            fetchIllusIntData(categoryID, illustrationID, true).then()
            navigate(`/gallery/${categoryID}`, {replace: true})
            setDisabledOperation(false)
        }
    }


    return loaded && categoryID && illustrationID ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div
                className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center shadow-gray-800 shadow-xl border border-gray-200 gap-4"
                style={{width: "95%", maxWidth: "500px", maxHeight: "98vh", overflowY: "auto"}}>

                <button
                        className="absolute right-6 mb-2 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg"
                        onClick={() => location.state?.from ? navigate(-1) : navigate(`/gallery/${categoryID}`, {replace: true})}> X
                </button>

                <h2 className="text-xl font-semibold text-center">Modify Illustration</h2>
                <img
                    src={showingGIF ? `/portfolio/dynamic/${categoryID}/${illustrationID}/${illusIntData[categoryID][illustrationID]["gif"]}` : `/portfolio/dynamic/${categoryID}/${illustrationID}/${illusIntData[categoryID][illustrationID]["images"][imageIndex]}`}
                    className="w-full object-contain rounded-lg mb-3"
                    style={{maxHeight: "500px"}}
                    alt={illusIntData[categoryID][illustrationID]["name"]}/>
                {illusIntData[categoryID][illustrationID]["gif"] ? <button
                    className="absolute top-24 right-10 text-white font-bold text-xl border-4 border-white rounded-lg px-2 py-2 shadow-inner transform"
                    onClick={() => setShowingGIF(!showingGIF)}
                >
                    {showingGIF ? "2D" : "3D"}
                </button> : null}
                <button
                    className="border border-4 border-gray-500 absolute left-2 top-1/2 -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 shadow-lg"
                    onClick={() => setImageIndex(imageIndex - 1)}
                    hidden={showingGIF || imageIndex <= 0}
                >
                    <img src={PrevTriangle} alt="Previous" className="w-4 h-4 opacity-70"/>
                </button>

                <button
                    className="border border-4 border-gray-500 absolute right-2 top-1/2 -translate-y-1/2 bg-white text-gray-700 rounded-full p-2 shadow-lg"
                    onClick={() => setImageIndex(imageIndex + 1)}
                    hidden={showingGIF || illusIntData[categoryID][illustrationID]["images"].length <= imageIndex + 1}
                >
                    <img src={NextTriangle} alt="Next" className="w-4 h-4 opacity-70"/>
                </button>

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
                    <option value="image">Images</option>
                    <option value="gif">GIF</option>
                    <option value="description">Description</option>
                    <option value="yt">Youtube</option>
                    <option value="roblox">Roblox</option>
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
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring
                            focus:ring-blue-300"
                               onChange={handlePriorityChange}
                               value={priority}
                               disabled={disabledOperation}
                        />
                    </div>
                </div>) : key === "thumbnail" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Change Thumbnail</label>
                        {imagePreviewURLList.length > 0 && (
                            <div className="w-full grid grid-cols-4 gap-2">
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
                                    </div>))}
                            </div>)}
                    </div>
                </div>) : key === "image" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Upload Images</label>
                        <input type="file" accept="image/*" className="w-full mb-2"
                               onChange={handleImageChange}
                               multiple={true}
                               disabled={disabledOperation}
                        />
                        {imagePreviewURLList.length > 0 && (
                            <div className="w-full grid grid-cols-4 gap-2">
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
                                    </div>))}
                            </div>)}
                    </div>
                </div>) : key === "gif" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Upload 3D GIF</label>

                        <input type="file" accept="image/*" className="w-full mb-2"
                               onChange={handleGifChange}
                               disabled={disabledOperation}
                        />
                        {gifPreviewURL && <img src={gifPreviewURL} alt="Preview"
                                               className="w-20 h-20 object-cover rounded-lg border "/>}
                    </div>
                </div>) : key === "description" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
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
                </div>) : key === "yt" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
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
                </div>) : key === "roblox" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
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
                            {roblox &&
                                <Link to={roblox} target={"_blank"}><img src={RobloxLogo} alt={"Roblox"}/></Link>}
                        </div>
                    </div>
                </div>) : key === "delete" ? (<div className="w-full flex flex-col gap-4 items-center p-4">
                    <div className="w-full">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Enter
                            "{name}" to confirm
                            delete:
                        </label>
                        <input type="text"
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                               value={verify}
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

                {
                    key ? <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                        onClick={handleSubmit}
                        disabled={disabledOperation}
                    >
                        Continue
                    </button> : null}
            </div>
        </div>) : null
}