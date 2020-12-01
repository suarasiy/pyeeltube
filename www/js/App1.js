let index = -1
let _pathed = false

// preventing refresh caused pyeel
eel.refresh();

function listening() {
    var search = document.querySelector("#search");
    search.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.querySelector("#btn_search").click();
        }
    })
}

listening();

function toggle(btn) {
    panel = document.querySelector("#menu");
    cover = document.querySelector("#menu-cover");
    panel.classList.toggle("active");
    cover.classList.toggle("hidden");
}

function panel_init() {
    panel = document.querySelector("#menu");
    panel_style = getComputedStyle(panel);
    left = panel_style.getPropertyValue("width").replace("px", "");
    panel.style.left = -Math.abs(left) + "px";
}

panel_init();

function searchVideos() {
    var textbox = document.querySelector("#search");
    var title = textbox.value;
    eel.makeObj(title)
}

// function set directory in python
function setDirectory() {
    eel.setDirectory()
}

eel.expose(getSelectedIndex)
function getSelectedIndex() {
    var checkboxes = document.querySelectorAll("input[name='img']:checked");
    const btn_download = document.querySelector("#btn_download");
    let index = [];
    checkboxes.forEach(function(item) {
        index.push(item.getAttribute("data-idx"));
        //console.log(item.getAttribute("data-idx"))
    })
    if (index.length <= 0 && (_pathed === false || _pathed === true)) {
        btn_download.classList.add("disabled");
        btn_download.disabled = true
    } else if (index.length > 0 && _pathed === true) {
        btn_download.classList.remove("disabled");
        btn_download.disabled = false
    }
    console.log("current : " + _pathed)
    btn_download.innerHTML = `(${index.length}) Download`;
    return index
}

eel.expose(is_pathed)
function is_pathed(path) {
    _pathed = path
}

eel.expose(makeObj);
function makeObj(imgurl) {
    index = index + 1;
    var panel = document.querySelector("#mgcheck");
    var box = document.createElement("IMG");

    var _checkbox = document.createElement("INPUT");
    _checkbox.setAttribute("type", "checkbox");
    _checkbox.setAttribute("name", "img");
    _checkbox.setAttribute("id", `cb${index}`);
    _checkbox.setAttribute("data-idx", index);
    _checkbox.addEventListener("click", function(e) {
        eel.is_pathed();
        getSelectedIndex();
        //console.log(getSelectedIndex());
    })
    panel.appendChild(_checkbox);

    var _label = document.createElement("LABEL");
    _label.setAttribute("for", `cb${index}`);
    panel.appendChild(_label);


    box.setAttribute("class", "content");
    box.setAttribute("src", imgurl);
    box.setAttribute("draggable", "false")
    
    _label.appendChild(box);
}
eel.expose(clearObj);
function clearObj() {
    index = -1
    var panel = document.querySelector("#mgcheck");
    panel.textContent = "";
    getSelectedIndex();
}

function sendList() {
    list = getSelectedIndex();
    eel.core_downloadThumbnails(list);
    //eel.getUrlFromIndex(list);
    //eel.createTk();
}

eel.expose(btnDownload)
function btnDownload(status) {
    var btn_download = document.querySelector("#btn_download");
    if (status === true) {
        btn_download.innerHTML = "Downloading...";
        btn_download.classList.add("disabled");
        btn_download.disabled = true
    } else {
        btn_download.classList.remove("disabled");
        btn_download.disabled = false
    }
}

eel.expose(download)
function download(url) {
    var index = getSelectedIndex();
    var frame = document.querySelector("#frame");
    index.forEach(function(i) {
        // console.log(i);
        frame.src = url;
    })
}

eel.expose(dialogSwap)
function dialogSwap(status, path) {
    var body = document.getElementById("_");
    var behind = document.getElementById("__");
    var pathbar = document.querySelector("#pathbar");
    if (status === true) {
        body.classList.add("disabled");
        behind.classList.remove("disabled");
        pathbar.innerHTML = `📁 Save path: ${path}`
        is_pathed();
    } else {
        body.classList.remove("disabled");
        behind.classList.add("disabled");
        pathbar.innerHTML = `📁 Save path: ${path}`
        is_pathed();
    }
}

eel.expose(progressbar)
function progressbar() {
    var download = document.querySelector(".progress-download");
    download.style.width = "0px";
    download.style.opacity = 0;
    download.style.backgroundColor = "rgb(255, 255, 255, 0.22)"
}

eel.expose(updateProgressbar)
function updateProgressbar(amountDownload) {
    var download = document.querySelector("#btn_download");
    var download_style = getComputedStyle(download);
    var progressbar = document.querySelector(".progress-download");
    var progressbar_style = getComputedStyle(progressbar);
    
    var maxwidth = parseFloat(download_style.getPropertyValue("width").replace("px", ""));
    var curwidth = parseFloat(progressbar_style.getPropertyValue("width").replace("px", ""));
    var setwidth = parseFloat(maxwidth / amountDownload);
    progressbar.style.backgroundColor = "rgb(0, 0, 0, 0.22)"
    progressbar.style.opacity = 1;
    progressbar.style.width = curwidth + setwidth + "px";
}

eel.expose(clearChecked)
function clearChecked() {
    var checkedList = document.querySelectorAll("input[name='img']:checked");
    checkedList.forEach(function(e) {
        e.checked = false;
    })
    getSelectedIndex();
}

function openDir() {
    eel.openDir();
}