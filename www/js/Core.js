console.clear()

let app = "APP_VIDEO"
let text_search_video = ""
let text_search_thumbnail = ""
let VIDEO_RESULT = 1
let THUMBNAIL_RESULT = 1
let APP_START = false

let index = 0
let _pathed = false

let player_autoplay = true

// var tag = document.createElement('script');
// tag.id = 'iframe-demo';
// tag.src = 'https://www.youtube.com/iframe_api';
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

eel.expose(length_video_result)
function length_video_result(total) {
    // VIDEO_RESULT = ""
    VIDEO_RESULT = total;
    // console.log("video total : " + VIDEO_RESULT)
}

eel.expose(length_thumbnail_result)
function length_thumbnail_result(total) {
    // THUMBNAIL_RESULT = 0;
    THUMBNAIL_RESULT = total;
    // console.log("thumbnail total : " + THUMBNAIL_RESULT);
}

eel.expose(text_search_focus)
function text_search_focus() {
    var search = document.querySelector("#search");
    if (search != undefined) {
        search.focus();
    }
}

function listening() {
    const div_search = document.querySelector(".input");
    const search = document.querySelector("#search");
    search.onkeyup = function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.querySelector("#btn_search").click();
        }
        if (app === "APP_VIDEO") {
            text_search_video = search.value;
            div_search.classList.remove("disabled");
        } else if (app === "APP_THUMBNAIL") {
            text_search_thumbnail = search.value;
            div_search.classList.remove("disabled");
        }
    }
}

function app_video_searchVideos() {
    var textbox = document.querySelector("#search");
    var title = textbox.value;
    disable_res_button();
    eel.search_videos(title);
}

function app_thumbnail_searchThumbnail() {
    var textbox = document.querySelector("#search");
    var title = textbox.value;
    eel.app1_makeObj(title)
}

function volume_iplayer() {
    var iframe_youtube = document.querySelector("#iframe_youtube");
    if (iframe_youtube != undefined) {
        iframe_youtube.setVolume(50);
    }
}

// function search //
function set_search(app_name) {
    if (app_name == "APP_VIDEO") {
        // console.log("app video search")
        app_video_searchVideos();
    } else if (app_name == "APP_THUMBNAIL") {
        // console.log("app thumbnail search")
        app_thumbnail_searchThumbnail();
    }
}

eel.expose(get_app)
function get_app(data) {
    // app = eel.get_app()
    app = data;
    // console.log(app)
}

function app_thread(app) {
    eel.app_thread(app)
}

function init_search_box() {
    var btn_search = document.querySelector("#btn_search");
    if (btn_search != undefined) {
        btn_search.onclick = function() {
            set_search(app);
        };
        listening();
    }
}

// init_search_box();

function page_videos() {
    const panel_videos = document.querySelector("#panel_videos");
    const panel_thumbnails = document.querySelector("#panel_thumbnails");
    const panel_about = document.querySelector("#panel_about");
    const btn_video = document.querySelector("#btn_menu_video");
    const btn_thumbnail = document.querySelector("#btn_menu_thumbnail");
    const btn_about = document.querySelector("#btn_menu_about");
    const search = document.querySelector("#search");
    const video_player = document.querySelector("#video_player");
    const div_search = document.querySelector(".input");
    const top_welcome = document.querySelector("#top-welcome-message");
    if (panel_thumbnails != undefined && btn_video != undefined && btn_thumbnail != undefined && search != undefined) {
        btn_video.classList.add("active");
        btn_about.classList.remove("active");
        btn_thumbnail.classList.remove("active");

        // panel show
        if ( APP_START !== true ) {
            top_welcome.classList.add("show");
        }

        panel_videos.classList.remove("disabled");
        panel_videos.removeAttribute("disabled");

        div_search.style.display = "flex";
        setTimeout( () => {
            div_search.classList.remove("disabled");
        }, 0);

        // panel hide
        panel_thumbnails.setAttribute("disabled", true);
        panel_thumbnails.classList.add("disabled");

        panel_about.setAttribute("disabled", true);
        panel_about.classList.add("disabled");

        video_player.setAttribute("video-status", "show");
        video_player.style.bottom = "10px";
        video_player.classList.remove("hide");

        if (VIDEO_RESULT > 0) {
            text_search_result("hide");
        } else {
            text_search_result("show");
        }

        search.value = text_search_video;
        search.focus();
    }
    toggle(this);
    app_thread("APP_VIDEO");
    init_search_box();
}

function page_thumbnails() {
    const panel_thumbnails = document.querySelector("#panel_thumbnails");
    const panel_videos = document.querySelector("#panel_videos");
    const panel_about = document.querySelector("#panel_about");
    const btn_video = document.querySelector("#btn_menu_video");
    const btn_thumbnail = document.querySelector("#btn_menu_thumbnail");
    const btn_menu_about = document.querySelector("#btn_menu_about");
    const search = document.querySelector("#search");
    const video_player = document.querySelector("#video_player");
    const iframe_youtube = document.querySelector("#iframe_youtube");
    const div_search = document.querySelector(".input");
    const top_welcome = document.querySelector("#top-welcome-message");
    if (panel_videos != undefined && btn_video != undefined && btn_thumbnail != undefined && search != undefined && iframe_youtube != undefined) {
        btn_video.classList.remove("active");
        btn_menu_about.classList.remove("active");
        btn_thumbnail.classList.add("active");

        panel_thumbnails.classList.remove("disabled");
        panel_thumbnails.removeAttribute("disabled");

        // panel show
        if ( APP_START !== true ) {
            top_welcome.classList.add("show");
        }

        // search show
        div_search.style.display = "flex";
        setTimeout( () => {
            div_search.classList.remove("disabled");
        }, 0);
        
        // panel hide
        panel_videos.setAttribute("disabled", true);
        panel_videos.classList.add("disabled");

        panel_about.setAttribute("disabled", true);
        panel_about.classList.add("disabled");

        var youtube_height = getComputedStyle(iframe_youtube).getPropertyValue("height");
        youtube_height = "-" + youtube_height;
        video_player.setAttribute("video-status", "hide");
        video_player.style.bottom = youtube_height;
        if ( !video_player.classList.contains("hide") ) {
            video_player.classList.toggle("hide");
        }

        if (THUMBNAIL_RESULT > 0) {
            text_search_result("hide");
        } else {
            text_search_result("show");
        }

        search.value = text_search_thumbnail;
        search.focus();
    }
    toggle(this);
    app_thread("APP_THUMBNAIL");
    init_search_box();
}

function page_about() {
    const panel_about = document.querySelector("#panel_about");
    const panel_videos = document.querySelector("#panel_videos");
    const panel_thumbnails = document.querySelector("#panel_thumbnails");
    const btn_videos = document.querySelector("#btn_menu_video");
    const btn_thumbnails = document.querySelector("#btn_menu_thumbnail");
    const btn_about = document.querySelector("#btn_menu_about");
    const div_search = document.querySelector(".input");
    const video_player = document.querySelector("#video_player");
    const iframe_youtube = document.querySelector("#iframe_youtube");
    const top_welcome = document.querySelector("#top-welcome-message");
    if ( panel_about != undefined && panel_videos != undefined && panel_thumbnails != undefined ) {
        btn_videos.classList.remove("active");
        btn_thumbnails.classList.remove("active");
        btn_about.classList.add("active");

        top_welcome.classList.remove("show");

        // panel show
        panel_about.classList.remove("disabled");
        panel_about.removeAttribute("disabled");

        // panel hide
        div_search.classList.add("disabled");
        setTimeout( () => {
            div_search.style.display = "none";
        }, 305);

        panel_thumbnails.classList.add("disabled");
        panel_thumbnails.setAttribute("disabled", true);

        panel_videos.classList.add("disabled");
        panel_videos.setAttribute("disabled", true);

        var youtube_height = getComputedStyle(iframe_youtube).getPropertyValue("height");
        youtube_height = "-" + youtube_height;
        video_player.setAttribute("video-status", "hide");
        video_player.style.bottom = youtube_height;
        if ( !video_player.classList.contains("hide") ) {
            video_player.classList.toggle("hide");
        }

        text_search_result("hide");
    }
    toggle(this);
    app_thread("APP_ABOUT");
    init_search_box();
}

function document_hotkey() {
    document.onkeydown = function(event) {
        if (event.ctrlKey && event.key === "q") {
            toggle_video();
        }
        if (event.ctrlKey && event.key === "1") {
            var data = document.querySelector("#toggle_l");
            toggle_video_size(data);
        }
        if (event.ctrlKey && event.key === "2") {
            var data = document.querySelector("#toggle_m");
            toggle_video_size(data);
        }
        if (event.ctrlKey && event.key === "w") {
            event.preventDefault();
        }
        if (event.ctrlKey && event.key === "f") {
            event.preventDefault();
        }
        if (event.ctrlKey && event.key === "t") {
            event.preventDefault();
        }
        if (event.ctrlKey && event.shiftKey) {
            event.preventDefault();
        }
        if (event.ctrlKey && event.key === "j") {
            event.preventDefault();
        }
        if (event.ctrlKey && event.key === "h") {
            event.preventDefault();
        }
        if (event.keyCode === 27) {
            event.preventDefault();
            // this for "escape to close modal"
            // const download_domain = document.querySelector(".download-domain");
            // const modal = download_domain.querySelector("#modal-1");
            // console.log("escaped!");
        }
    }
}

document_hotkey();

init_search_box();

function toggle(btn) {
    const panel = document.querySelector("#menu");
    const cover = document.querySelector("#menu-cover");
    panel.classList.toggle("active");
    cover.classList.toggle("hidden");
}

function toggle_video() {
    var video_player = document.querySelector("#video_player");
    var iframe_youtube = document.querySelector("#iframe_youtube");
    if (video_player != undefined && iframe_youtube != undefined) {
        var video_status = video_player.getAttribute("video-status");
        var y = getComputedStyle(iframe_youtube).getPropertyValue("height");
        if (video_status == "show") {
            video_player.setAttribute("video-status", "hide");
            y = "-" + y;
        } else if (video_status == "hide") {
            video_player.setAttribute("video-status", "show");
            y = "10px";
        }
        video_player.style.bottom = y;
        video_player.classList.toggle("hide");
    }
}

function toggle_video_size(btn) {
    var iframe_youtube = document.querySelector("#iframe_youtube");
    var video_player = document.querySelector("#video_player");
    let size;
    let status_visible;
    size = btn.getAttribute("youtube-option-size");
    if (iframe_youtube != undefined && video_player != undefined) {
        status_visible = video_player.getAttribute("video-status");
        if (status_visible != "hide") {
            if (size == "M") {
                var n = document.querySelector("#toggle_l");
                n.classList.remove("active");
                iframe_youtube.classList.remove("size-l");
                iframe_youtube.classList.add("size-m");
            } else {
                var n = document.querySelector("#toggle_m");
                n.classList.remove("active");
                iframe_youtube.classList.remove("size-m");
                iframe_youtube.classList.add("size-l");
            }
            btn.classList.add("active");
        }
    }
}

function panel_init() {
    const panel = document.querySelector("#menu");
    let panel_style = getComputedStyle(panel);
    let left = panel_style.getPropertyValue("width").replace("px", "");
    panel.style.left = -Math.abs(left) + "px";
}

panel_init()

function number_with_comma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function modal_close() {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector("#modal-1");
    if (modal != undefined && download_domain != undefined) {
        // modal.style.transform = "translate(-50%, -50%) scale(.65)";
        // modal.style.opacity = 0;
        // download_domain.style.opacity = 0;
        modal.classList.add("hide");
        download_domain.classList.add("hide");
        setTimeout(function() {
            // download_domain.style.display = "none";
            download_domain.classList.add("hide-block");
        }, 305)
    }
}

eel.expose(modal_url_close)
function modal_url_close() {
    var modal = document.querySelector("#modal-2");
    var url_domain = document.querySelector(".url-domain");
    if (modal != undefined && url_domain != undefined) {
        modal.style.transform = "translate(-50%, -50%) scale(.65)";
        modal.style.opacity = 0;
        url_domain.style.opacity = 0;
        setTimeout(function() {
            url_domain.style.display = "none";
        }, 305);
    }
}



// preventing refresh caused pyeel
eel.refresh();


eel.expose(progress_search_fill_animation)
function progress_search_fill_animation(model) {
    var progress_search = document.querySelector(".progress-search-fill");
    if (progress_search != undefined) {
        if (model.toLowerCase() == "search") {
            progress_search.classList.remove("progress-search-fill-fetch");
            progress_search.classList.add("progress-search-fill-search");
        } else if (model.toLowerCase() == "fetch") {
            progress_search.classList.remove("progress-search-fill-search");
            progress_search.classList.add("progress-search-fill-fetch");
        } else if (model.toLowerCase() == "fetch_feedback") {
            progress_search.classList.add("fetch-feedback");
        } else if (model.toLowerCase() == "none") {
            progress_search.classList.remove("progress-search-fill-fetch");
            progress_search.classList.remove("progress-search-fill-search");
            progress_search.classList.remove("fetch-feedback");
        }
    }
}

// function searchVideos() {
//     var textbox = document.querySelector("#search");
//     var title = textbox.value;
//     disable_res_button();
//     eel.search_videos(title);
// }

eel.expose(search_get_first_item)
function search_get_first_item() {
    var content = document.querySelectorAll(".content")[0]
    var thumbnails = content.querySelector("#video_img");
    var id = content.querySelector(".block");
    if (content != undefined) {
        background_dynamic(thumbnails.getAttribute("src"));
        frame_youtube(id.innerText);
    }
}

function setDirectory() {
    eel.setDirectory()
    // modal_button_download(true);
}

eel.expose(is_pathed)
function is_pathed(path) {
    _pathed = path
    app1_getSelectedIndex();
}

function get() {
    makeObj("1", "yanagi", "yanagihara", "88191", "https://pm1.narvii.com/6439/97d3b7c9d8b66b049a6983ed8c9b1d7331c94de2_hq.jpg");
}

eel.expose(makeObj);
function makeObj(_id, _title, _channel, _viewer, _imgurl, _video_url, _duration) {
    index = index + 1;
    
    var panel = document.querySelector("#panel_videos");
    
    var content = document.createElement("DIV");
    content.setAttribute("class", "content");
    
    var span = document.createElement("span");
    span.setAttribute("class", "index");
    span.setAttribute("index-idx", index);
    span.innerText = index;
    panel.appendChild(content);
    content.appendChild(span);

    var thumbnails = document.createElement("DIV");
    thumbnails.setAttribute("class", "thumbnails");
    content.append(thumbnails);

    var image = document.createElement("img");
    image.setAttribute("id", "video_img");
    image.setAttribute("src", _imgurl);
    image.setAttribute("alt", "");
    image.setAttribute("draggable", false);
    thumbnails.appendChild(image);

    var duration = document.createElement("span");
    duration.setAttribute("class", "duration");
    duration.innerText = _duration;
    thumbnails.appendChild(duration);

    var information = document.createElement("DIV");
    information.setAttribute("class", "information");
    information.setAttribute("id", _id);
    content.appendChild(information);

    var title = document.createElement("span");
    title.innerText = _title;
    title.setAttribute("class", "title");
    title.setAttribute("title-idx", index);
    title.addEventListener("click", function() {
        // console.log(_id);
        frame_youtube(_id);
        background_dynamic(_imgurl);
        ui_change_status(title.getAttribute("title-idx"));
    });
    information.appendChild(title);

    var row_block = document.createElement("DIV");
    row_block.setAttribute("class", "row");
    information.appendChild(row_block);


    var span_video_id = document.createElement("span");
    span_video_id.setAttribute("class", "block");
    var span_video_id_icon = document.createElement("img");
    span_video_id_icon.setAttribute("src", "icon/127_linking.png");
    span_video_id_icon.setAttribute("alt", "");
    span_video_id_icon.setAttribute("draggable", false);
    
    row_block.appendChild(span_video_id);
    span_video_id.appendChild(span_video_id_icon);
    span_video_id.innerHTML += _id;

    var span_video_viewer = document.createElement("span");
    span_video_viewer.setAttribute("class", "block");
    var span_video_viewer_icon = document.createElement("img");
    span_video_viewer_icon.setAttribute("src", "icon/127_eye.png");
    span_video_viewer_icon.setAttribute("alt", "");
    span_video_viewer_icon.setAttribute("draggable", false);
    
    row_block.appendChild(span_video_viewer);
    span_video_viewer.appendChild(span_video_viewer_icon);
    span_video_viewer.innerHTML += "Views : " + number_with_comma(_viewer);

    var channel = document.createElement("span");
    channel.setAttribute("class", "channel");
    channel.innerText = _channel;
    information.appendChild(channel);

    var label = document.createElement("span");
    label.setAttribute("class", "label");
    label.innerText = "Available resolution:";
    information.appendChild(label);

    var row_wrap = document.createElement("DIV");
    row_wrap.setAttribute("class", "row wrap");
    row_wrap.setAttribute("data-row-idx", index);
    information.append(row_wrap);

    var btn_fetch = document.createElement("button");
    btn_fetch.setAttribute("class", "res fetch");
    btn_fetch.addEventListener("click", function(e) {
        // eel.Video(_video_url, row_wrap.getAttribute("data-row-idx"));
        btn_please_wait(row_wrap.getAttribute("data-row-idx"));
        navbar_control(false);
        progress_search_fill_animation("fetch");
        disable_res_button();
        eel.init_video(_video_url, row_wrap.getAttribute("data-row-idx"), "panel");
    });
    row_wrap.appendChild(btn_fetch);
    
    var span_top = document.createElement("span");
    span_top.setAttribute("class", "top");
    span_top.innerText = "FETCH";
    btn_fetch.appendChild(span_top);
}

eel.expose(object_update)
function object_update(
    _id,
    _title,
    _channel,
    _viewer,
    _imgurl,
    _video_url,
    _duration
    ) {
        const panel = document.querySelector("#panel_videos");
        const content = panel.querySelector(".content");
        const thumbnails = content.querySelector(".thumbnails");
        const image = thumbnails.querySelector("#video_img");
        const duration = thumbnails.querySelector(".duration");
        const information = content.querySelector(".information");
        const title = information.querySelector(".title");
        const row_block = information.querySelector(".row");
        const span_video_id = row_block.querySelectorAll(".block")[0];
        var span_video_id_icon = document.createElement("img");
        const span_video_viewer = row_block.querySelectorAll(".block")[1];
        var span_video_viewer_icon = document.createElement("img");
        const channel = information.querySelector(".channel");
        const row_wrap = information.querySelector(".row.wrap");
        const btn_fetch = row_wrap.querySelector(".res.fetch");
        if (
            image != undefined &&
            duration != undefined &&
            title != undefined &&
            span_video_id != undefined &&
            span_video_viewer != undefined &&
            channel != undefined &&
            btn_fetch != undefined
        ) {
            image.setAttribute("src", _imgurl);
            duration.innerText = _duration;
            title.innerText = _title;
            title.addEventListener("click", () => {
                frame_youtube(_id);
                background_dynamic(_imgurl);
                ui_change_status(title.getAttribute("title-idx"));
            })
            span_video_id.innerText = ""
            span_video_viewer.innerText = ""
            span_video_id_icon.setAttribute("src", "icon/127_linking.png");
            span_video_id_icon.setAttribute("alt", "");
            span_video_id_icon.setAttribute("draggable", false);
            span_video_id.appendChild(span_video_id_icon);
            span_video_id.innerHTML += _id;
            span_video_viewer_icon.setAttribute("src", "icon/127_eye.png");
            span_video_viewer_icon.setAttribute("alt", "");
            span_video_viewer_icon.setAttribute("draggable", false);
            span_video_viewer.appendChild(span_video_viewer_icon);
            span_video_viewer.innerHTML += "Views : " + number_with_comma(_viewer);
            channel.innerText = _channel;
            btn_fetch.style.display = "none";
            console.log("URL FETCHED DONE!")
        }
    }

eel.expose(object_resolution);
function object_resolution(data_itag, data_type, parent_idx, resolution, frame, itag, data_filesize) {
    var parent = document.querySelectorAll('[data-row-idx]')[parent_idx-1]
    var res = document.createElement("button");
    res.setAttribute("data-res-itag", data_itag);
    res.setAttribute("disabled", true);
    if (data_type == "audio") {
        res.setAttribute("class", "res music");
    } else {
        res.setAttribute("class", "res");
    }
    res.classList.add("res-disable");
    res.setAttribute("data-resolution", resolution.replace("p", ""))
    res.style.transform = "scale(0)";
    parent.appendChild(res); // <- check here!

    let information = res.parentNode.parentNode;
    res.addEventListener("click", function(e) {
        // console.log(itag);
        eel.init_check(data_itag, parent_idx, res.getAttribute("data-resolution"), information.getAttribute("id"));
    })

    var do_column = document.createElement("DIV");
    do_column.setAttribute("class", "do-column");
    res.appendChild(do_column);

    var row = document.createElement("DIV");
    row.setAttribute("class", "row");
    do_column.appendChild(row);
    
    setTimeout(function() {
        res.style.transform = "scale(1)";
    }, 222);
    var top = document.createElement("span");
    var fps = document.createElement("span");
    top.setAttribute("class", "top");
    fps.setAttribute("class", "fps");
    top.innerText = resolution;
    fps.innerText = frame;
    row.appendChild(top);
    row.appendChild(fps);

    var filesize = document.createElement("SPAN");
    filesize.setAttribute("class", "filesize")
    filesize.innerText = data_filesize + "Mb";
    do_column.appendChild(filesize);
}

eel.expose(get_download_info);
function get_download_info(data_itag, data_rowidx, data_imgurl, data_title, data_resolution, data_duration, data_fps, data_filesize, data_extension, data_pathtemp, data_pathsave, is_ready) {
    var info_resolution = document.querySelectorAll(".info.resolution")[0];
    var info_fps = document.querySelectorAll(".info.fps")[0];
    var info_filesize = document.querySelectorAll(".info.filesize")[0];
    var info_extension = document.querySelectorAll(".info.extension")[0];

    var path_temp = document.querySelector("#path_temp");
    var path_save = document.querySelector("#path_save");

    var modal = document.querySelector(".modal");
    modal.setAttribute("modal-row-idx", data_rowidx);
    modal.setAttribute("modal-row-itag", data_itag);
    var download_domain = document.querySelector(".download-domain");

    if (modal != undefined && info_resolution != undefined && info_fps != undefined && info_filesize != undefined && info_extension != undefined && path_temp != undefined && path_save != undefined) {
        info_resolution.innerText = data_resolution;
        info_resolution.setAttribute("data-info-resolution", data_resolution);
        info_fps.innerText = data_fps;
        info_filesize.innerText = data_filesize + "Mb";
        info_extension.innerText = data_extension;

        var btn_download = download_domain.querySelector("#download_domain");

        var cover = download_domain.querySelector("#thumbnails");
        var duration = download_domain.querySelector(".duration");
        var title = download_domain.querySelectorAll(".title")[0];
        cover.setAttribute("src", data_imgurl);
        duration.innerText = data_duration;
        title.innerText = data_title;

        if (data_resolution == "null") {
            info_resolution.style.display = "none";
            btn_download.classList.remove("btn-main");
            btn_download.classList.add("btn-music");
        } else {
            info_resolution.style.display = "block";
            btn_download.classList.remove("btn-music");
            btn_download.classList.add("btn-main");
        }

        path_temp.innerText = data_pathtemp;
        path_save.innerText = data_pathsave;
        
        modal_button_download(is_ready);
        com_status(true);
        
        // download_domain.style.display = "block";
        // download_domain.classList.remove("hide");
        download_domain.classList.remove("hide-block");

        // modal.style.display = "block";
        // modal.classList.remove("hide");
        modal.classList.remove("hide-block");
        setTimeout(function() {
            // download_domain.style.opacity = 1;
            download_domain.classList.remove("hide");
            // modal.style.transform = "translate(-50%, -50%) scale(1)";
            // modal.style.opacity = 1;
            modal.classList.remove("hide");
        }, 105);
    }
}

eel.expose(set_link_url)
function set_link_url(url) {
    var text_url = document.querySelector("#modal_url");
    var url_domain = document.querySelector(".url-domain");
    var modal = url_domain.querySelector("#modal-2");
    if (
        text_url != undefined &&
        url_domain != undefined &&
        modal != undefined
        ) {
        text_url.value = url;
        url_domain.style.display = "block";
        modal.style.display = "block";
        setTimeout(function() {
            url_domain.style.opacity = 1;
            modal.style.transform = "translate(-50%, -50%) scale(1)";
            modal.style.opacity = 1;
        }, 105);
    }
}

eel.expose(url_get_status)
function url_get_status(status) {
    const url_domain = document.querySelector(".url-domain");
    const btn_get = url_domain.querySelector("#get_domain_url");
    if ( status === true ) {
        btn_get.classList.remove("btn-disabled");
        btn_get.removeAttribute("disabled");
    } else if ( status === false ) {
        btn_get.classList.add("btn-disabled");
        btn_get.setAttribute("disabled", true);
    }
}

function set_url() {
    eel.fetch_from_url();
}

eel.expose(url_progress_status)
function url_progress_status(status) {
    const url_domain = document.querySelector(".url-domain");
    const btn_get = url_domain.querySelector("#get_domain_url");
    const progress = url_domain.querySelector(".progress-fill");
    const btn_close = url_domain.querySelector("#close_domain_url");
    const btn_refresh = url_domain.querySelector("#refresh_domain_url");
    if ( status === true ) {
        progress.classList.add("progress-search-search");

        btn_get.classList.add("btn-disabled");
        btn_get.setAttribute("disabled", true);
        
        btn_close.classList.add("btn-disabled");
        btn_close.setAttribute("disabled", true);

        btn_refresh.classList.add("btn-disabled");
        btn_refresh.setAttribute("disabled", true);
    } else if ( status === false ) {
        progress.classList.remove("fetch-feedback");
        progress.classList.remove("progress-search-search");

        btn_get.classList.remove("btn-disabled");
        btn_get.removeAttribute("disabled");
        
        btn_close.classList.remove("btn-disabled");
        btn_close.removeAttribute("disabled");

        btn_refresh.classList.remove("btn-disabled");
        btn_refresh.removeAttribute("disabled");
    }
}

eel.expose(url_progress_feedback)
function url_progress_feedback() {
    const url_domain = document.querySelector(".url-domain");
    const progress = url_domain.querySelector(".progress-fill");
    progress.classList.add("fetch-feedback");
}

url_get_status(false);

function modal_url_info() {
    eel.is_url_youtube();
}

eel.expose(gsd)
function gsd(sd) {
    console.log(sd);
}

eel.expose(disable_res_button)
function disable_res_button() {
    var res = document.querySelectorAll("[data-resolution]");
    if (res != undefined) {
        for (let i = 0; i < res.length; i ++) {
            // res[i].setAttribute("class", `${res[i].getAttribute("class")} res-disable`);
            // res[i].classList.toggle("res-disable");
            res[i].classList.add("res-disable");
            res[i].setAttribute("disabled", true);
        }
    }
}

eel.expose(enable_res_button)
function enable_res_button() {
    var res = document.querySelectorAll("[data-resolution]");
    if (res != undefined) {
        for (let i = 0; i < res.length; i ++) {
            // res[i].classList.toggle("res-disable");
            res[i].classList.remove("res-disable");
            res[i].removeAttribute("disabled");
        }
    }
}

eel.expose(popup_result)
function popup_result(bool) {
    var popup = document.querySelector("#popup-not-found");
    if (popup != undefined) {
        if (bool == "show") {
            popup.classList.add("show");
        } else if (bool == "hide") {
            popup.classList.remove("show");
        }
    }
}

eel.expose(text_search_result)
function text_search_result(bool) {
    var result = document.querySelector("#top-not-found-1");
    if (result != undefined) {
        if (bool === "show") {
            result.classList.add("show");
        } else if (bool === "hide") {
            result.classList.remove("show");
        }
    }
}

eel.expose(hide_welcome)
function hide_welcome() {
    const top_welcome = document.querySelector("#top-welcome-message");
    if ( top_welcome != undefined ) {
        top_welcome.classList.remove("show");
    }
    APP_START = true;
}

eel.expose(clearObj);
function clearObj() {
    index = 0 // -1
    var panel = document.querySelector("#panel_videos");
    panel.textContent = "";
}

eel.expose(btn_fetch_normal)
function btn_fetch_normal(parent_idx) {
    var parent = document.querySelectorAll('[data-row-idx]')[parent_idx-1]
    var btn_fetch = parent.querySelector(".res.fetch.loading")
    var top = btn_fetch.getElementsByTagName('SPAN')[0]
    if (btn_fetch != undefined && top != undefined) {
        btn_fetch.removeAttribute("disabled")
        btn_fetch.setAttribute("class", "fetch res")
        top.innerText = "FETCH"
    }
}

function btn_please_wait(parent_idx) {
    var parent = document.querySelectorAll('[data-row-idx]')[parent_idx-1]
    var btn_fetch = parent.querySelector(".res.fetch")
    var top = btn_fetch.getElementsByTagName('SPAN')[0]
    if (btn_fetch != undefined && top != undefined) {
        btn_fetch.setAttribute("disabled", true)
        btn_fetch.setAttribute("class", "fetch res loading")
        top.innerText = "Please wait..."
    }
}

eel.expose(btn_finish_fetch)
function btn_finish_fetch(parent_idx) {
    var parent = document.querySelectorAll('[data-row-idx]')[parent_idx-1]
    var btn_fetch = parent.querySelector('.res.fetch')
    if (btn_fetch != undefined) {
        btn_fetch.style.display = "none";
    }
}

function change_autoplay(btn) {
    player_autoplay = !player_autoplay;
    btn.classList.toggle("active");
    console.log('status autoplay ' + +player_autoplay);
}

eel.expose(frame_youtube)
function frame_youtube(id) {
    var iframe = document.querySelector("#iframe_youtube");
    if (iframe != undefined) {
        
        // url = `https://www.youtube.com/embed/${id}?enablejsapi=1&controls=0&rel=0&autoplay=${+player_autoplay}`
        // changeVideo(url);

        // url = iframe.src;
        // url = url.replace(url.match(/autoplay=[01]/)[0], `autoplay=${+player_autoplay}`);
        changeVideo(id);
        
        // console.log("old url : " + iframe.src)
        // iframe.setAttribute("src", `https://www.youtube.com/embed/${id}?enablejsapi=1&controls=0&rel=0&autoplay=${player_autoplay}`);
        // console.log("new url : " + iframe.src);
    }
    // changeVideo(id);
    // onYouTubeIframeAPIReady(id);
    // console.log("change nope : " + url);
}

var player;
function onYouTubeIframeAPIReady(id) {
    player = new YT.Player('iframe_youtube', {
        playerVars: { "autoplay": +player_autoplay, "loop" : 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    // console.log("status now : " + +player_autoplay)
}

function onPlayerReady(event) {
    event.target.setVolume(30)
    document.getElementById('iframe_youtube').style.borderColor = 'rgb(46, 185, 250)';
}

function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
        color = "rgb(206, 206, 206)"; // unstarted = gray
    } else if (playerStatus == 0) {
        color = "rgb(183, 227, 23)"; // ended = yellow
    } else if (playerStatus == 1) {
        color = "rgb(135, 100, 255)"; // playing = green
    } else if (playerStatus == 2) {
        color = "rgb(255, 23, 62)"; // paused = red
    } else if (playerStatus == 3) {
        color = "rgb(49, 232, 186)"; // buffering = purple
    } else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
        document.getElementById('iframe_youtube').style.borderColor = color;
    }
}

function onPlayerStateChange(event) {
	changeBorderColor(event.data);
}

function changeVideo(id) {
    player.loadVideoById({
        videoId: id
    })
    // player.loadVideoByUrl({
    //     mediaContentUrl: url
    // })
    // console.log("load : " + url);
}

function ui_change_status(row_idx) {
    var content = document.querySelectorAll(".content")[row_idx-1];
    var index = content.querySelector(".index");
    var indexs = document.querySelectorAll("[status-preview=true]");

    for (let i = 0; i < indexs.length; i++) {
        indexs[i].setAttribute("status-preview", false);
        indexs[i].innerText = indexs[i].getAttribute("index-idx");
    }

    if (content != undefined) {
        index.innerText = "On preview";
        index.setAttribute("status-preview", true);
    }
}

eel.expose(background_dynamic)
function background_dynamic(imageurl) {
    var body = document.getElementsByTagName("BODY")[0];
    var blur = document.getElementById("blur-domain");
    if (body != undefined && blur != undefined) {
        body.style.backgroundImage = `url("${imageurl}")`;
        blur.style.backgroundImage = `url("${imageurl}")`;
    }
}

eel.expose(modal_update_status)
function modal_update_status(text) {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");

    if (download_domain != undefined && modal != undefined) {
        var text_status = modal.querySelector("#action_text_status");
        text_status.innerText = text;
    }
}

eel.expose(modal_update_progress)
function modal_update_progress(value) {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    var progress = modal.querySelector("#action_progress");
    const progress_percent = document.querySelector("#progress_percent");

    if (download_domain != undefined && modal != undefined && progress != undefined) {
        progress.style.width = `${value}%`;
        progress_percent.style.left = `${value}%`;
        progress_percent.innerText = `${value}%`;
        // console.log(value);
    }
}

// for download process
eel.expose(modal_animation_download)
function modal_animation_download() {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    const progress_percent = document.querySelector("#progress_percent");

    if (download_domain != undefined) {
        var progress = modal.querySelector("#action_progress");

        progress_percent.classList.add("show");

        progress.classList.remove("ready");
        progress.classList.remove("merging");
        progress.classList.remove("loading");
    }
}

// for merging process
eel.expose(modal_animation_merging)
function modal_animation_merging() {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    const progress_percent = document.querySelector("#progress_percent");

    if (download_domain != undefined) {
        var progress = modal.querySelector("#action_progress");

        progress_percent.classList.remove("show");

        progress.classList.remove("ready");
        progress.classList.add("merging");
        progress.classList.remove("loading");
    }
}

// for cleaning file(s) temporary
eel.expose(modal_animation_loading)
function modal_animation_loading() {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    const progress_percent = document.querySelector("#progress_percent");

    if (download_domain != undefined) {
        var progress = modal.querySelector("#action_progress");

        progress_percent.classList.remove("show");

        progress.classList.remove("ready");
        progress.classList.remove("merging");
        progress.classList.add("loading");
    }
}

// --- ready animation or after successfully downloaded files --- //
eel.expose(modal_animation_ready)
function modal_animation_ready() {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    const progress_percent = document.querySelector("#progress_percent");

    if (download_domain != undefined) {
        var progress = modal.querySelector("#action_progress");

        progress_percent.classList.remove("show");
        
        progress.style.width = "0px";
        progress_percent.innerText = "0%";
        progress_percent.style.left = "0px";


        progress.classList.add("ready");
        progress.classList.remove("merging");
        progress.classList.remove("loading");
    }
}
// -------------------------------------------------------------- //

function com_status(status) {
    var com_folder = document.querySelector("#com");
    if (status === true) {
        com_folder.setAttribute("onclick", "setDirectory()");
    } else if (status === false) {
        com_folder.setAttribute("onclick", "");
    }
}
eel.expose(modal_button_download)
function modal_button_download(status) {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    var btn_download = modal.querySelector("#download_domain");
    var com_folder = document.querySelector("#com");
    if (status === true) {
        btn_download.classList.remove("btn-disabled");
        btn_download.removeAttribute("disabled");
        com_folder.setAttribute("onclick", "setDirectory()");
    } else if (status === false) {
        btn_download.classList.add("btn-disabled");
        btn_download.setAttribute("disabled", true);
        com_folder.setAttribute("onclick", "");
    }
}

eel.expose(modal_button_close)
function modal_button_close(status) {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    var btn_close = modal.querySelector("#close_domain");
    if (download_domain != undefined && modal != undefined && btn_close != undefined) {
        if (status === true) {
            btn_close.classList.remove("btn-disabled");
            btn_close.removeAttribute("disabled");
        } else if (status === false) {
            btn_close.classList.add("btn-disabled");
            btn_close.setAttribute("disabled", true);
        }
    }
}

eel.expose(navbar_control)
function navbar_control(status) {
    var form = document.querySelector(".form");
    var btn_url_download = form.querySelector("#btn_urldownload");
    var search = form.querySelector("#search");
    var btn_search = form.querySelector("#btn_search");
    var btn_directory = form.querySelector("#btn_directory");

    if (form != undefined && btn_url_download != undefined && btn_search != undefined && btn_directory != undefined && search != undefined) {
        if (status === true) {
            btn_url_download.removeAttribute("disabled");
            search.removeAttribute("disabled");
            btn_search.removeAttribute("disabled");
            btn_directory.removeAttribute("disabled");
        } else if (status === false) {
            btn_url_download.setAttribute("disabled", true);
            search.setAttribute("disabled", true);
            btn_search.setAttribute("disabled", true);
            btn_directory.setAttribute("disabled", true);
        }
    }
}

// -- core main download after python --- //
function modal_core_download() {
    var download_domain = document.querySelector(".download-domain");
    var modal = download_domain.querySelector(".modal");
    var info_resolution = modal.querySelector(".info.resolution");
    let row_idx, itag, res;

    if (download_domain != undefined && info_resolution != undefined) {
        row_idx = modal.getAttribute("modal-row-idx");
        itag = modal.getAttribute("modal-row-itag");
        res = info_resolution.getAttribute("data-info-resolution").replace("p", "");
        eel.modal_core_download(itag, row_idx, res);
    }
}
// -------------------------------------- //

// --- show path folder dialog via tkinter python --- //
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
    var path_save = document.querySelector("#path_save");
    path_save.innerText = path
}
// -------------------------------------------------- //

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
    progressbar.style.backgroundColor = "rgb(0, 0, 0, 0.22)";
    progressbar.style.opacity = 1;
    progressbar.style.width = curwidth + setwidth + "px";
}

function openDir() {
    eel.openDir();
}




// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------
// -----------------------------------------------------------





let app1_index = -1
// let _pathed = false

// preventing refresh caused pyeel

// function listening() {
//     var search = document.querySelector("#search");
//     search.addEventListener("keyup", function(event) {
//         if (event.keyCode === 13) {
//             event.preventDefault();
//             document.querySelector("#btn_search").click();
//         }
//     })
// }

// listening();

function panel_init() {
    const panel = document.querySelector("#menu");
    const panel_style = getComputedStyle(panel);
    const left = panel_style.getPropertyValue("width").replace("px", "");
    panel.style.left = -Math.abs(left) + "px";
}

panel_init();

// function searchVideos() {
//     var textbox = document.querySelector("#search");
//     var title = textbox.value;
//     eel.makeObj(title)
// }

// function set directory in python
// function setDirectory() {
//     eel.setDirectory()
// }

eel.expose(app1_getSelectedIndex)
function app1_getSelectedIndex() {
    var checkboxes = document.querySelectorAll("input[name='img']:checked");
    const btn_download = document.querySelector("#btn_download");
    let index = [];
    checkboxes.forEach(function(item) {
        index.push(item.getAttribute("data-idx"));
        //console.log(item.getAttribute("data-idx"))
    })
    if (index.length <= 0 || _pathed === false) {
        btn_download.classList.add("disabled");
        btn_download.disabled = true
    } else if (index.length > 0 && _pathed === true) {
        btn_download.classList.remove("disabled");
        btn_download.disabled = false
    }
    // console.log("current : " + _pathed)
    btn_download.innerHTML = `(${index.length}) Download`;
    return index
}

// eel.expose(is_pathed)
// function is_pathed(path) {
//     _pathed = path
// }

eel.expose(app1_makeObj);
function app1_makeObj(imgurl) {
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
        // app1_getSelectedIndex();
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
eel.expose(app1_clearObj);
function app1_clearObj() {
    index = -1
    var panel = document.querySelector("#mgcheck");
    panel.textContent = "";
    app1_getSelectedIndex();
}

function sendList() {
    let list;
    list = app1_getSelectedIndex();
    eel.app1_core_downloadThumbnails(list);
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
    var index = app1_getSelectedIndex();
    var frame = document.querySelector("#frame");
    index.forEach(function(i) {
        // console.log(i);
        frame.src = url;
    })
}

eel.expose(progressbar)
function progressbar() {
    var download = document.querySelector(".progress-download");
    download.style.width = "0px";
    download.style.opacity = 0;
    download.style.backgroundColor = "rgb(255, 255, 255, 0.22)"
}

eel.expose(clearChecked)
function clearChecked() {
    var checkedList = document.querySelectorAll("input[name='img']:checked");
    checkedList.forEach(function(e) {
        e.checked = false;
    })
    app1_getSelectedIndex();
}

function openDir() {
    eel.openDir();
}
