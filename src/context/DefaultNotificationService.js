import {createContext, useContext, useEffect, useState} from "react";

export const DefaultNotificationProvider = createContext(null);


let nextId = 1;
export default function DefaultNotification({children}) {
    const [notifications, setNotifications] = useState([]);

    const newNotification = (message) => {
        setNotifications(prev => {
            let updated = [...prev, {id: nextId++, message: message}];
            if (updated.length > 10) {
                updated = updated.slice(updated.length - 10);
            }
            return updated;
        });
    };

    useEffect(() => {
        const timers = notifications.map((notification) => setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 7000));
        return () => {
            timers.forEach(clearTimeout);
        };
    }, [notifications]);

    return (<DefaultNotificationProvider.Provider value={{newNotification}}>
            <div className="fixed top-4 space-y-2"
                 style={{zIndex: 50}}>
                {notifications.map((notification) => (<div key={notification.id}
                                                           style={{border: "4px solid #ffc300"}}
                                                           className="bg-white border shadow-xl rounded-xl px-4 py-2 text-gray-800 transition-opacity duration-300">
                        {notification.message}
                    </div>))}
            </div>
            {children}
        </DefaultNotificationProvider.Provider>)
}

export const UseDefaultNotification = () => useContext(DefaultNotificationProvider);