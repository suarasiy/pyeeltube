# youtube downloader
import os
import eel
from collections import namedtuple
import pytube
from pytube.extract import mime_type_codec
from youtubesearchpython import SearchVideos
from colorama import *
import package.Temporary as Temp
from package.History import History
from pytube import YouTube
from package.Filename import *
import subprocess
import time
import json
import requests
from requests.exceptions import HTTPError
import tkinter as tk
from tkinter import filedialog
import math

# from App1
import package.Style as box
from datetime import datetime as dt

os.system("")
app_thread = ["APP_VIDEO", "APP_THUMBNAIL"]
app = ""
path = ""

@eel.expose
def get_app():
    global app
    eel.get_app(app)

@eel.expose
def app_thread(data):
    global app
    app = data
    get_app()


# --- core class --- #
class Core:
    # operation system color initialized
    os.system("")

    # --- declare global static  variable --- #
    ds = ""
    ds_1 = ""
    video = ""  # YouTube(url, on_progress_callback=True)
    result = "" # video.streams
    history = {}
    file_size = 0
    path = ""
    # --------------------------------------- #

    # --- constructor callable --- #
    def __call__(self):
        return self.result
    # ---------------------------- #

    # --- number checker whether positive or negative --- #
    def number_is_positive(self, number):
        if number >= 0:
            return True
        else:
            return False
    # --------------------------------------------------- #

    # --- get progress (core) download --- #
    def on_progress(self, chunk, file_handler, bytes_remaining):
        global file_size
        size = self.file_size

        # --- get progress value (float) --- #
        progress = (100 * (size - bytes_remaining)) / size
        # ---------------------------------- #

        # --- checking whether progress not negative value --- #
        if self.number_is_positive(progress) & int(progress) <= 100:
            # print(f"{int(progress)}% Downloading...")
            self.modal_update_progress(int(progress))
        # ---------------------------------------------------- #

        # --- checking whether value is 100 (completed) --- #
        if int(progress) == 100:
            # print(f"{int(progress)}% Download Completed!")
            self.modal_update_progress(int(progress))
        # ------------------------------------------------- #
    # ------------------------------------ #

    # -- set video information --- #
    @eel.expose
    def Video(self, url, row_idx):
        global video
        global result
        def core():
            try:
                print("Initializing, please wait...")
                self.video = YouTube(url, on_progress_callback=self.on_progress)
                self.result = self.video.streams
                audio_size = self.get_audio_default().filesize
                print("Initializing done.")
                print("Fetching result...")
                for data in self.quality():
                    if data != False:
                        print(data)
                        eel.object_resolution(data.itag, data.type, row_idx, data.resolution, data.fps, data.itag, round(((data.filesize + audio_size) / math.pow(1*10, 6)), 2))
                        eel.disable_res_button()
                eel.object_resolution(self.get_audio_default().itag, self.get_audio_default().type, row_idx, self.get_audio_default().subtype, self.get_audio_default().abr.replace("kbps", ""), self.get_audio_default().itag, round(audio_size / math.pow(1*10, 6), 2))
                eel.navbar_control(True)
                eel.progress_search_fill_animation("none");
            except pytube.exceptions.RegexMatchError as ex:
                print("Regex error. Try to re-initializing...")
                core()
            except HTTPError as ex:
                print("HTTP Error 404: Not found.")
        core()
    # ---------------------------- #

    # --- eel update progress download --- #
    def modal_update_progress(self, value):
        eel.modal_update_progress(value)
    # ------------------------------------ #

    # --- get info video.streams --- #
    def str_getInfo(self):
        global result
        ([(print(i, sep="\n")) for i in self.result])
    # ------------------------------ #

    # --- get audio only (default: 128kbps) standard quality and best choice for merging --- #
    def get_audio_default(self):
        global file_size
        global result
        
        audio = self.result.get_audio_only(subtype="mp4")
        if audio != None:
            self.file_size = audio.filesize
            return audio
        else:
            self.get_audio(self.result)
    # -------------------------------------------------------------------------------------- #

    # --- get the best audio quality object (160kbps) audio/webm opus --- #
    def get_audio(self):
        global file_size
        global result
        # --- priority get (160kbps) opus audio/webm --- #
        audio1 = [i for i in self.result.filter(
            adaptive=True,
            mime_type="audio/webm"
        )]
        # ---------------------------------------------- #

        # --- [BUG] --- #
        # --- second priority get (128kbps) mp4 audio/mp4 --- #
        audio2 = self.result.get_audio_only()
        # --------------------------------------------------- #

        # --- absolute return only 1 file --- #
        if len(audio1) == 1:
            self.file_size = 0
            self.file_size = audio1[0].filesize
            return audio1[0]
        # ----------------------------------- #
        # --- another (X-160)kbps initialized --- #
        elif len(audio1) > 1:
            audio1 = self.result.filter(
                adaptive=True,
                mime_type="audio/webm",
                abr="160kbps"
            )
            # --- priority 160kbps --- #
            if len(audio1) > 0:
                self.file_size = 0
                self.file_size = audio1[0].filesize
                return audio1[0]
            # ------------------------ #
        # --- [BUG] --- #
        # --- getting 128kbps audio --- #
        else:
            self.file_size = 0
            self.file_size = audio2.filesize
            return audio2
        # ----------------------------- #
    # ------------------------------------------------------------------- #

    # --- get downloadable video based on filter quality --- #
    def get_downloadable(self, streams):
        # --- set prototype property callable --- #
        prototype = namedtuple("get_downloadable", ["res480", "res720", "res1080", "res1440", "res2160"])
        # ------------------------------------- #

        # --- list of video each quality filtered [480-2160] --- #
        _480p = [i for i in streams.filter(
            adaptive=True,
            resolution="480p",
            mime_type="video/mp4"
        )]
        _720p = [i for i in streams.filter(
            adaptive=True,
            resolution="720p",
            mime_type="video/mp4"
        )]
        _1080p = [i for i in streams.filter(
            adaptive=True,
            resolution="1080p",
            mime_type="video/mp4"
        )]
        _1440p = [i for i in streams.filter(
            adaptive=True,
            resolution="1440p"
        )]
        _2160p = [i for i in streams.filter(
            adaptive=True,
            resolution="2160p"
        )]
        # ----------------------------------------------------- #
        return prototype(_480p, _720p, _1080p, _1440p, _2160p)
    # --------------------------------------------------------- #

    # --- returning best fps (60) if available, default is (30) --- #
    def fps_cleansing(self, source):
        # --- set cleansing property callable --- #
        cleansing = namedtuple("cleansing", ["res480", "res720", "res1080", "res1440", "res2160"])
        # --------------------------------------- #

        # --- set cleansing property each res from get_downloadable() --- #
        cleansing_480 = self.get_downloadable(source).res480
        cleansing_720 = self.get_downloadable(source).res720
        cleansing_1080 = self.get_downloadable(source).res1080
        cleansing_1440 = self.get_downloadable(source).res1440
        cleansing_2160 = self.get_downloadable(source).res2160
        # --------------------------------------------------------------- #
        
        # --- cleansing fps, force to get (60) if available, keep 30 if not available --- #
        def clean(cleansing):
            if len(cleansing) > 1:
                for i in cleansing:
                    if i.fps == 60:
                        pass
                    else:
                        if len(cleansing) > 1:
                            cleansing.remove(i)
                        else:
                            pass
            if len(cleansing) == 1:
                return cleansing[0]
            else:
                return False
        # ------------------------------------------------------------------------------- #

        # --- based on get_downloadable (output), checking if the're available for (60) than 30 --- #
        cleansing_480 = clean(cleansing_480)
        cleansing_720 = clean(cleansing_720)
        cleansing_1080 = clean(cleansing_1080)
        cleansing_1440 = clean(cleansing_1440)
        cleansing_2160 = clean(cleansing_2160)
        # ----------------------------------------------------------------------------------------- #

        # --------------------------------------------------------- #
        return cleansing(cleansing_480, cleansing_720, cleansing_1080, cleansing_1440, cleansing_2160)
    # ------------------------------------------------------------- #

    # --- merging file after completed the download file(s) --- #
    def merge(self, pathfile_video, pathfile_audio, model):
        # --- (output) path save directory --- #
        # path_save = "D:\yanagihara\python\downloader"
        path = self.path
        # ------------------------------------ #
        
        def merge_video(path_video, path_audio):
            # --- (output) filename --- #
            output_name = f"{cleansing(self.video.title)}.mp4"
            # ------------------------- #

            # --- [FIX IT] -> Just used double quote instead double backslash --- #
            # --- replacing backslash into single reverse one --- #
            pathfile_video = path_video.replace("\\", "/")
            pathfile_audio = path_audio.replace("\\", "/")
            # --------------------------------------------------- #

            # --- Merge command ffmpeg pre-processing video audio --- #
            # command_merge = f'ffmpeg.exe -i "{pathfile_video}" -i "{pathfile_audio}" -c copy -c:a aac "{os.path.join(path, output_name)}"'
            command_merge = f'ffmpeg.exe -i "{pathfile_video}" -i "{pathfile_audio}" -c copy -c:a mp3 "{os.path.join(path, output_name)}"'
            # ------------------------------------------------------- #

            # --- Execute command merge based ffmpeg.exe --- #
            self.run_command(command_merge)
        
        def convert_audio(path_audio):
            # --- (output) filename --- #
            output_name = f"{cleansing(self.video.title)}.mp3"
            # ------------------------- #

            # --- [FIX IT] -> Just used double quote instead double backslash --- #
            # --- replacing backslash into single reverse one --- #
            pathfile_audio = path_audio.replace("\\", "/")
            # --------------------------------------------------- #

            # --- Merge command ffmpeg pre-processing video audio --- #
            # command_merge = f'ffmpeg.exe -i "{pathfile_video}" -i "{pathfile_audio}" -c copy -c:a aac "{os.path.join(path, output_name)}"'
            command_merge = f'ffmpeg.exe -i "{pathfile_audio}" -vn -b:a 128K "{os.path.join(path, output_name)}"'
            # ------------------------------------------------------- #

            # --- Execute command merge based ffmpeg.exe --- #
            self.run_command(command_merge)
        
        if model == "video":
            merge_video(pathfile_video, pathfile_audio)
        elif model == "audio":
            convert_audio(pathfile_audio)
        # ---------------------------------------------- #
        return "Merging file(s) completed"
    # --------------------------------------------------------- #

    # --- execute command under subprocess.call module --- #
    def run_command(self, command):
        try:
            # --- get time process begin --- #
            start = time.time()
            # --------------------------------- #
            print("Please wait, merging process being run...")

            # --- execute command shell based {command} --- #
            subprocess.call(
                command,
                shell=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            # --------------------------------------------- #

            # --- get time after process --- #
            end = time.time()
            # ------------------------------ #

            # --- calculate elapsed time process --- #
            print("Merge and rewrite done. Elapsed : %.2fsec." % (end-start))
            # -------------------------------------- #
        
        # --- raise Exception error --- #
        except Exception as ex:
            print(ex)
        # -------------------------------- #
    # ---------------------------------------------------- #

    # --- add filename, pathvideo, pathaudio to dictionary --- #
    def add_to_history(self, path, model):
        global video
        global history

        def history_video():
            # --- joining path and title with static extension --- #
            video_path = os.path.join(path, cleansing(self.video.title) + ".mp4")
            audio_path = os.path.join(path, "audio.mp4")
            # audio_path = os.path.join(path, cleansing(self.video.title) + ".mp4")
            # ---------------------------------------------------- #

            # --- merging video audio and fixing video codec by ffmpeg --- #
            eel.modal_update_status("Merging...")
            eel.modal_animation_merging()
            self.merge(video_path, audio_path, "video")
            # ------------------------------------------------------------ #

            # --- declare dummy History object --- #
            _history = History(self.video.title, video_path, audio_path)
            # ------------------------------------ #

            # --- assignment history to global history based dictionary datatype --- #
            self.history[_history.getKey] = _history.getValue
            # ---------------------------------------------------------------------- #
        
        def history_audio():
            # --- joining path and title with static extension --- #
            video_path = os.path.join(path, cleansing(self.video.title) + ".mp4")
            audio_path = os.path.join(path, cleansing(self.video.title) + ".mp4")
            # ---------------------------------------------------- #

            # --- merging video audio and fixing video codec by ffmpeg --- #
            eel.modal_update_status("Converting...")
            eel.modal_animation_merging()
            self.merge(video_path, audio_path, "audio")
            # ------------------------------------------------------------ #

            # --- declare dummy History object --- #
            _history = History(self.video.title, video_path, audio_path)
            # ------------------------------------ #

            # --- assignment history to global history based dictionary datatype --- #
            self.history[_history.getKey] = _history.getValue
            # ---------------------------------------------------------------------- #

        if model == "video":
            history_video()
        elif model == "audio":
            history_audio()

    # -------------------------------------------------------- #

    # --- cleaning temprorary video audio --- #
    def delete_after_download(self):
        try:
            # --- global initialized --- #
            global history
            global video
            # -------------------------- #

            print("Prepare for cleaning temprorary file(s).")

            # --- adding delay on running the code --- #
            eel.modal_update_status("Cleaning temporary...")
            eel.modal_animation_loading()
            time.sleep(3.5)
            # ---------------------------------------- #

            # --- fetching video path, audio path from history dictionary --- #
            datapath = [self.history[cleansing(self.video.title)][x] for x in self.history[cleansing(self.video.title)]]
            # --------------------------------------------------------------- #

            # --- removing datafile(s) if exist. (default=True) --- #
            for path in datapath:
                if os.path.isfile(path):
                    os.remove(path)
            # ----------------------------------------------------- #
        
        # --- raise Exception error --- #
        except Exception as ex:
            print(ex)
        # ----------------------------- #
    # --------------------------------------- #

    # --- (semi-core) fetching video quality and prototype --- #
    @eel.expose
    def quality(self):
        global result
        source = self.fps_cleansing(self.result)
        return source
    # -------------------------------------------------------- #

    def each_quality_size(self):
        filesizes = {}
        audio_size = self.get_audio_default().filesize
        for data in self.quality():
            if data != False:
                filesizes[data.resolution.replace("p", "")] = round((data.filesize + audio_size) / math.pow(1*10,6), 2)
        filesizes[self.get_audio_default().abr] = round((audio_size) / math.pow(1*10, 6), 2)
        
        return filesizes

    # # --- child of quality --- #
    # def idx_quality(self, row_idx):
    #     self = init_check(row_idx)
    #     quality()
    # # ------------------------ #

    # --- (core) download video-audio based result.streams and quality prototype --- #
    @eel.expose
    def core_download(self, quality):
        try:
            # --- global initialized --- #
            global history
            global file_size
            global result
            # -------------------------- #
            self.file_size = 0

            # --- get path-temp on system based from Temprorary module --- #
            path = Temp.system_gettemp()
            # ------------------------------------------------------------ #

            # --- default is object. bool is False / resolution not identified --- #
            # --- regardless resolution is initialized when tried to download --- #
            if type(quality) != bool:
                print("Please wait until downloading finished...")

                # --- webm opus (160)kbps is priority --- #
                # --- get best audio to download --- #
                eel.modal_update_status("Downloading... (audio)")
                eel.modal_animation_download()
                self.get_audio_default().download(path, "audio")
                # ---------------------------------- #

                # --- determine file size --- #
                self.file_size = quality.filesize
                # --------------------------- #

                # (semi-core as core) with quality based to download (2nd) --- #
                eel.modal_update_status("Downloading... (video)")
                eel.modal_animation_download()
                quality.download(path)
                # ------------------------------------------------------------ #
                
                # --- core backend process --- #
                # --- adding datainfo to history dictionary --- #
                self.add_to_history(path, "video")
                # --------------------------------------------- #
                # --- immediately delete the temprorary file(s) after all downloaded --- #
                self.delete_after_download()
                # ---------------------------------------------------------------------- #
                
                eel.modal_update_status("Ready")
                eel.modal_animation_ready()
                print("Download completed.")
            
            # --- regardless resolution is not initialized when tried to download --- #
            else:
                print("can't download. not exist!")

        # --- raise Exception error --- #
        except Exception as ex:
            print(ex)
        # ----------------------------- #
    # ------------------------------------------------------------------------------ #

    # --- download audio only --- #
    def core_download_audio(self):
        try:
            self.file_size = 0

            # --- get path-temp on system based from Temporary moduyle --- #
            path = Temp.system_gettemp()
            # ------------------------------------------------------------ #
            print("Starting download audio...")
            eel.modal_update_status("Downloading audio only...")
            eel.modal_animation_download()
            self.get_audio_default().download(path)

            # --- add fileinfo to download history --- #
            self.add_to_history(path, "audio")
            # ---------------------------------------- #

            # --- add to history download --- #
            self.delete_after_download()
            # ------------------------------- #

            eel.modal_update_status("Ready")
            eel.modal_animation_ready()

            print("Download success.")
        except ValueError as ex:
            print(ex)
    # --------------------------- #

# --- end of core class --- #


# --- eel --- #

# --- dictionary master --- #
master = {}
datasource = {}
# ------------------------- #

# --- datasource configuration --- #
def search( _title, _offset, _mode, _count):
    return SearchVideos(
        _title,
        offset=_offset,
        mode=_mode,
        max_results=_count
    )
# -------------------------------- #

# --- init data --- #
def fetch_search(ctx):
    ctx = ctx.result()
    data = json.loads(ctx)
    for _data in data["search_result"]:
        _title = _data["title"]
        print("[x]", _title)
    return data
# ----------------- #

# --- deterimine image url is have a good response or not --- #
def image_code_status(url):
    r = requests.get(url)
    if r.status_code == 404:
        return "image/lina.jpg"
    else:
        return url
# ----------------------------------------------------------- #

# --- make object --- #
def get_result(source):
    global datasource
    data = source["search_result"]
    eel.clearObj()
    eel.length_video_result(len(data))
    if len(data) > 0:
        # eel.popup_result("hide")
        eel.text_search_result("hide")
        for idx in data:
            datasource[idx["id"]] = {
                "id" : idx["id"],
                "title" : idx["title"],
                "channel" : idx["channel"],
                "views" : idx["views"],
                "thumbnails" : idx["thumbnails"][4],
                "duration" : idx["duration"],
                "link" : idx["link"]
            }
            _id = idx["id"]
            _title = idx["title"]
            _channel = idx["channel"]
            _viewer = idx["views"]
            _imgurl = idx["thumbnails"][4]
            _duration = idx["duration"].replace(".", ":")
            # _imgurl = image_code_status(_imgurl)
            _link = idx["link"]
            eel.makeObj(_id, _title, _channel, _viewer, _imgurl, _link, _duration)
        print(datasource);
        eel.search_get_first_item()
        eel.enable_res_button()
    else:
        # eel.popup_result("show")
        eel.text_search_result("show")
        print(f"{Fore.RED}Result not found{Fore.RESET}")
        
    eel.navbar_control(True)
    eel.progress_search_fill_animation("none")
    eel.text_search_focus()
# ------------------- #

# --- get datasource videos --- #
def init_search(title):
    global ds
    print("Searching videos. Please wait...")
    eel.navbar_control(False)
    eel.progress_search_fill_animation("search")
    ds = fetch_search(
        search(
            title,
            1,
            "json",
            15
        )
    )
    get_result(ds)
# ----------------------------- #

# --- search videos --- #
@eel.expose
def search_videos(title):
    init_search(title)
# --------------------- #


def is_path_available():
    global path
    return os.path.isdir(path)

def init_check_get_info(itag, row_idx, source, result, filesize, id):
    global datasource
    global path
    temp = Temp
    data_title = result
    data_resolution = source.resolution
    data_abr = source.abr
    data_fps = source.fps
    data_filesize = filesize
    data_extension = source.type
    print("0 :", itag)
    print("1 :", data_resolution)
    print("2 :", data_fps)
    print("3 :", data_filesize)
    print("4 :", data_extension)
    print(datasource[id]["duration"].replace(".", ":"))
    if source.type == "audio":
        eel.get_download_info(itag, row_idx, datasource[id]["thumbnails"], data_title, "null", datasource[id]["duration"].replace(".", ":"), data_abr, data_filesize, data_extension, temp.system_gettemp(), path.replace("/", "\\"), is_path_available())
    elif source.type == "video":
        eel.get_download_info(itag, row_idx, datasource[id]["thumbnails"], data_title, data_resolution, datasource[id]["duration"].replace(".", ":"), f"{data_fps}fps", data_filesize, data_extension, temp.system_gettemp(), path.replace("/", "\\"), is_path_available())


# --- check master dictionary --- #
@eel.expose
def init_check(data_itag, row_idx, res, id):
    print(master[row_idx])
    core = master[row_idx]["self"]
    core_filesize = master[row_idx]["filesize"]
    core_result = core.video.title
    audio_size = round(core.get_audio().filesize / math.pow(1*10, 6), 2);
    
    # --- re-constructing --- #

    # --- getting object audio via itag --- #
    def init_by_itag(itag):
        obj = core.result.get_by_itag(itag)
        if obj != None:
            if obj.type == "video":
                init_check_get_info(itag, row_idx, core.result.get_by_itag(itag), core_result, core_filesize[(core.result.get_by_itag(itag).resolution.replace("p", ""))], id)
            elif obj.type == "audio":
                init_check_get_info(itag, row_idx, core.result.get_by_itag(itag), core_result, core_filesize[(core.result.get_by_itag(itag).abr)], id)
        return core.result.get_by_itag(itag)
    # ------------------------------------- #
    
    # --- getting resolution --- #
    def get_by_resolution(res):
        if res.lower() == "2160":
            print(core.quality().res2160)
            init_check_get_info(row_idx, core.quality().res2160, core_result, core_filesize["2160"], id)
        elif res.lower() == "1440":
            print(core.quality().res1440)
            init_check_get_info(row_idx, core.quality().res1440, core_result, core_filesize["1440"], id)
        elif res.lower() == "1080":
            print(core.quality().res1080)
            init_check_get_info(row_idx, core.quality().res1080, core_result, core_filesize["1080"], id)
        elif res.lower() == "720":
            print(core.quality().res720)
            init_check_get_info(row_idx, core.quality().res720, core_result, core_filesize["720"], id)
        elif res.lower() == "480":
            print(core.quality().res480)
            init_check_get_info(row_idx, core.quality().res480, core_result, core_filesize["480"], id)
        
        if res.lower() == "ogg":
            print(core.get_audio())
            init_check_get_info(row_idx, core.get_audio(), core_result, audio_size, id)
    # -------------------------- #
    
    # --- init by itag --- #
    init_by_itag(data_itag)
    # -------------------- #

    # ----------------------- #

    return print(master[row_idx]["self"])
# ------------------------------- #

def get_filesizes(source):
    print(source)

# --- core eel --- #
@eel.expose
def init_video(url, row_idx):
    core = Core()
    master[row_idx] = {"self" : core, "url" : url}
    core.Video(url, row_idx)
    
    # get_filesizes(master[row_idx]["self"])
    get_filesizes(core.each_quality_size())

    # --- update key 'filesizes' in master dictionary --- #
    master[row_idx]["filesize"] = core.each_quality_size()
    # --------------------------------------------------- #

    eel.btn_finish_fetch(row_idx)
    eel.enable_res_button()
    print(master)
# ---------------- #

@eel.expose
def modal_core_download(itag, row_idx, res):
    global path
    core = master[row_idx]["self"]
    core.path = path
    
    def core_by_itag(itag):
        obj = core.result.get_by_itag(itag)
        print("by core itag :", obj)
        if obj != None:
            eel.modal_button_close(False)
            eel.modal_button_download(False)
            if obj.type == "video":
                core.core_download(obj)
            elif obj.type == "audio":
                core.core_download_audio()

    def core_by_res(res):
        if res.lower() == "2160":
            print("detected 2160")
            core.core_download(core.quality().res2160)
        elif res.lower() == "1440":
            print("detected 1440")
            core.core_download(core.quality().res1440)
        elif res.lower() == "1080":
            print("detected 1080")
            core.core_download(core.quality().res1080)
        elif res.lower() == "720":
            print("detected 720")
            core.core_download(core.quality().res720)
        elif res.lower() == "480":
            print("detected 480")
            core.core_download(core.quality().res480)
        
        if res.lower() == "ogg":
            print("currently under developing...")

    core_by_itag(itag)
    eel.modal_button_close(True)
    eel.modal_button_download(True)

# --- eel response refresher --- #
@eel.expose
def refresh():
    global path
    global ds
    global ds_1
    global master
    master = {}
    ds = ""
    ds_1 = ""
    path = ""
    print(f"{Fore.GREEN}(Listening){Fore.RESET} to {Fore.BLUE}Python{Fore.RESET}")
    print(master)
# ------------------------------ #

# --- eel directory dialog --- #
@eel.expose
def is_pathed():
    global path
    print("catch : ", path)
    if len(path) > 0:
        print("set to true")
        eel.is_pathed(True)
    else:
        eel.is_pathed(False)

@eel.expose
def setDirectory():
    global path
    root = tk.Tk()
    root.attributes("-topmost", True)
    root.withdraw()
    eel.dialogSwap(True, "")
    eel.navbar_control(False)
    path = filedialog.askdirectory()
    while True:
        if len(path) > 0:
            eel.dialogSwap(False, path)
            break
        else:
            eel.dialogSwap(True, "")
            path = filedialog.askdirectory()
    is_pathed()
    eel.navbar_control(True)

    # app1
    eel.app1_getSelectedIndex()

    print("Path set to :", path)
    del root

# ---------------------------- #


# --- @app2 --- #
def app1_getThumbnails(ctx):
    ctx = ctx.result()
    data = json.loads(ctx)
    index = 0
    print("\nSearching...")
    for _data in data["search_result"]:
        index = index + 1
        title = _data["title"]
        print(f"[{Fore.BLUE}{index}{Fore.RESET}] {title}")
    eel.text_search_focus()
    print("==Done result==")
    print()
    return data

def app1_getUrlThumbnails(source):
    data = source["search_result"]
    eel.app1_clearObj()

    eel.length_thumbnail_result(len(data))
    if len(data) > 0:
        eel.text_search_result("hide")
        for idx in data:
            url = idx["thumbnails"][4]
            eel.app1_makeObj(url)
    else:
        eel.text_search_result("show")

def app1_is_downloadable(url):
    head = requests.head(url, allow_redirects=True)
    header = head.headers
    content_type = header.get("Content-Type")
    if "text" in content_type.lower():
        return False
    if "html" in content_type.lower():
        return False
    return True

def app1_initTitle(title):
    global ds_1
    ds_1 = app1_getThumbnails(
        search(
            title, 
            1,
            "json",
            15
        )
    )
    app1_getUrlThumbnails(ds_1)

@eel.expose
def app1_makeObj(title):
    app1_initTitle(title)

@eel.expose
def app1_getUrlFromIndex(idx):
    idx = [(int(x)) for x in idx]
    global ds_1
    data = ds_1["search_result"]
    for i in idx:
        url = data[i]["thumbnails"][4]
        eel.download(url)

@eel.expose
def app1_setDirectory():
    global path
    root = tk.Tk()
    root.attributes("-topmost", True)
    root.withdraw()
    eel.dialogSwap(True, "")
    path = filedialog.askdirectory()
    while True:
        if len(path) > 0:
            eel.dialogSwap(False, path)
            break
        else:
            eel.dialogSwap(True, "")
            path = filedialog.askdirectory()
    is_pathed()
    eel.getSelectedIndex()
    print("Path set to :", path)
    del root

@eel.expose
def app1_is_pathed():
    global path
    print("catch : ", path)
    if len(path) > 0:
        print("set to true")
        eel.is_pathed(True)
    else:
        eel.is_pathed(False)

def app1_getFileSize(url):
    data = requests.head(url, allow_redirects=True)
    header = data.headers
    size = header["Content-Length"]
    size = round(float(size)/1024, 1)
    return size

@eel.expose
def app1_core_downloadThumbnails(_list):
    global path
    global ds_1
    data = ds_1["search_result"]
    _list = ([int(_list) for _list in _list])
    amount = len(_list);
    pathsave = path.replace("/", "\\")
    eel.progressbar()
    eel.btnDownload(True)
    try:
        for idx in _list:
            title = cleansing(data[idx]["title"])
            url_thumbnails = data[idx]["thumbnails"][4]
            size = app1_getFileSize(url_thumbnails)
            thumbname = url_thumbnails.rsplit("/", 1)[1]
            print(f"{Fore.BLUE}get :{Fore.RESET}", title)
            r = requests.get(url_thumbnails)
            if app1_is_downloadable(url_thumbnails):
                with open(f"{pathsave}\\{title}_{thumbname}", "wb") as file:
                    print(f"{Fore.GREEN}({size} KB) Downloading : {Fore.RESET}{Fore.BLUE}{title}{Fore.RESET}")
                    file.write(r.content)
                    eel.updateProgressbar(amount)
                    print(f"{box.style(0, 37, 42)}Download Success{box.end()}")
        
        time.sleep(.5)
        eel.btnDownload(False)
        eel.clearChecked()
        eel.progressbar()
        
    except Exception as ex:
        print(f"{box.style(0,37,41)}Error catched.{box.end()}")

# ------------- #


eel.init("www")
eel.start("index.html")