const localStorageKey = "userLogin";

const getUserLogin = () => {
    let statusLogin = false;
    const emptyData = { content: "empty" };

    const data = JSON.parse(localStorage.getItem(localStorageKey));

    if (localStorage.getItem(localStorageKey) === null) {
        // console.log("data kosong")
        localStorage.setItem(localStorageKey, JSON.stringify(emptyData))
    }
    else if (data.content === emptyData.content) {
        // console.log("ada isi tapi default")
    } else {
        statusLogin = true;
        // console.log("Load data sukses! isi data : " + data);
    }

    // console.log(data);
    console.log("Status login : " + statusLogin);
    return { data, statusLogin };
}

const setUserLogin = (newData) => {
    localStorage.setItem(localStorageKey, JSON.stringify(newData));
    // return console.log("set data completed!");
}

const removeUserLogin = () => {
    localStorage.removeItem(localStorageKey);
    localStorage.clear();
}

export { getUserLogin, setUserLogin, removeUserLogin }