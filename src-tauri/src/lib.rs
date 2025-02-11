use std::ffi::CStr;
use std::ptr::{self, null, NonNull};
use std::sync::Mutex;
#[cfg(windows)]
use tauri::menu::{Menu, MenuBuilder, MenuItem};
#[cfg(windows)]
use tauri::tray::{TrayIcon, TrayIconBuilder, TrayIconEvent};
#[cfg(windows)]
use tauri::{AppHandle, Manager, WindowEvent};
#[cfg(windows)]
use winapi::shared::windef::HWND;
#[cfg(windows)]
use winapi::um::winuser::{
    EnumWindows, FindWindowA, FindWindowExA, GetClassNameA, GetWindowLongPtrA, IsZoomed,
    SendMessageA, SetForegroundWindow, SetParent, SetWindowLongPtrA, SetWindowPos, ShowWindow,
    GWL_EXSTYLE, HWND_BOTTOM, SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SW_MAXIMIZE, SW_RESTORE,
    WS_EX_APPWINDOW, WS_EX_LAYERED, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW,
};



static WALLPAPER_MODE: Mutex<bool> = Mutex::new(false);
#[cfg(windows)]
fn toggle_wallpaper_mode(app: &AppHandle) {
    let window = app.get_webview_window("shinoa").expect("找不到主窗口");
    let mut is_wallpaper = WALLPAPER_MODE.lock().unwrap();
    window.set_decorations(*is_wallpaper);
    unsafe {
        let hwnd = window.hwnd().unwrap().0 as HWND;
        if !*is_wallpaper {
            let progman = FindWindowA(b"Progman\0".as_ptr() as *const i8, ptr::null());
            SendMessageA(progman, 0x052C, 0, 0);

            let mut workerw: HWND = ptr::null_mut();

            extern "system" fn enum_windows(hwnd: HWND, param: isize) -> i32 {
                unsafe {
                    let workerw = param as *mut HWND;
                    let mut class_name = [0u8; 256];
                    if GetClassNameA(hwnd, class_name.as_mut_ptr() as *mut i8, 256) != 0 {
                        let class_name = CStr::from_ptr(class_name.as_ptr() as *const i8);
                        if class_name.to_bytes() == b"WorkerW" {
                            let shelldll_defview = FindWindowExA(
                                hwnd,
                                ptr::null_mut(),
                                b"SHELLDLL_DefView\0".as_ptr() as *const i8,
                                ptr::null(),
                            );
                            if !shelldll_defview.is_null() {
                                *workerw = FindWindowExA(
                                    ptr::null_mut(),
                                    hwnd,
                                    b"WorkerW\0".as_ptr() as *const i8,
                                    ptr::null(),
                                );
                                return 0;
                            }
                        }
                    }
                    1
                }
            }

            EnumWindows(Some(enum_windows), &mut workerw as *mut HWND as isize);

            if !workerw.is_null() {
                SetWindowPos(
                    hwnd,
                    HWND_BOTTOM,
                    0,
                    0,
                    0,
                    0,
                    SWP_NOSIZE | SWP_NOACTIVATE,
                );
                SetParent(hwnd, workerw);
            }
        } else {
            SetParent(hwnd, ptr::null_mut());
        }
        window.maximize();
    }
    *is_wallpaper = !*is_wallpaper;
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(mobile)]
#[tauri::mobile_entry_point]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(windows)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let active = MenuItem::with_id(app, "active", "激活", true, None::<&str>)?;
            let wall_papper =
                MenuItem::with_id(app, "wall_papper", "切换壁纸", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&active, &wall_papper, &quit_i])?;
            let window = app.get_webview_window("shinoa").unwrap();
            let window_clone = window.clone(); 

            let hwnd = window.hwnd().unwrap().0 as HWND;
            // 监听窗口事件
            window.on_window_event(move |event| {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close(); 
                    window_clone.hide().unwrap(); 
                }
            });
            let tray = TrayIconBuilder::new()
                .menu(&menu)
                .menu_on_left_click(false)
                .icon(app.default_window_icon().unwrap().clone())
                .on_tray_icon_event(move |app, event| {
                    match event {
                        TrayIconEvent::DoubleClick { .. } => {
                            window.show().unwrap();
                            unsafe {
                                let hwnd = window.hwnd().unwrap().0 as HWND;
                                window.show().unwrap();
                                SetForegroundWindow(hwnd);
                                // show_window(&window);
                            }
                        }
                        _ => {} 
                    }
                })
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "wall_papper" => {
                        toggle_wallpaper_mode(app);
                    }
                    "active" => {
                        if let Some(window) = app.get_webview_window("shinoa") {
                            unsafe {
                                let hwnd = window.hwnd().unwrap().0 as HWND;
                                window.show().unwrap();
                                SetForegroundWindow(hwnd);
                            }
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {
                        println!("menu item {:?} not handled", event.id);
                    }
                })
                .build(app)?;
            unsafe {
                // 获取当前窗口样式
                let style = GetWindowLongPtrA(hwnd, GWL_EXSTYLE);
                SetWindowLongPtrA(
                    hwnd,
                    GWL_EXSTYLE,
                    (style as u32 | WS_EX_LAYERED | WS_EX_NOACTIVATE) as isize,
                );
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
