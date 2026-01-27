; NSIS installer for Sistema Relatorios (Windows)
; Build: "C:\Program Files (x86)\NSIS\makensis.exe" installer\setup.nsi

!define APP_NAME "Sistema Relatorios"
!define APP_EXE "SistemaRelatorios-Windows.exe"
!define APP_VERSION "1.0.0"
!define COMPANY_NAME "Sistema Relatorios"
!define INSTALL_DIR "$PROGRAMFILES\\Sistema Relatorios"

Name "${APP_NAME}"
OutFile "..\\dist\\SistemaRelatorios-Setup.exe"
InstallDir "${INSTALL_DIR}"
InstallDirRegKey HKLM "Software\\${APP_NAME}" "InstallDir"
RequestExecutionLevel admin

ShowInstDetails show
ShowUninstDetails show

!include "MUI2.nsh"

!define MUI_ABORTWARNING
!define MUI_ICON "${__FILEDIR__}\\app.ico"
!define MUI_UNICON "${__FILEDIR__}\\app.ico"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"

  File "..\\dist\\Windows\\${APP_EXE}"
  File "..\\dist\\.env.example"
  File "${__FILEDIR__}\\app.ico"

  CreateDirectory "$SMPROGRAMS\\${APP_NAME}"
  CreateShortCut "$SMPROGRAMS\\${APP_NAME}\\${APP_NAME}.lnk" "$INSTDIR\\${APP_EXE}" "" "$INSTDIR\\app.ico" 0
  CreateShortCut "$DESKTOP\\${APP_NAME}.lnk" "$INSTDIR\\${APP_EXE}" "" "$INSTDIR\\app.ico" 0

  WriteUninstaller "$INSTDIR\\Uninstall.exe"

  WriteRegStr HKLM "Software\\${APP_NAME}" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "Publisher" "${COMPANY_NAME}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "UninstallString" "$INSTDIR\\Uninstall.exe"
  WriteRegDWORD HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "NoModify" 1
  WriteRegDWORD HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "NoRepair" 1
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\\${APP_NAME}.lnk"
  Delete "$SMPROGRAMS\\${APP_NAME}\\${APP_NAME}.lnk"
  RMDir "$SMPROGRAMS\\${APP_NAME}"

  Delete "$INSTDIR\\${APP_EXE}"
  Delete "$INSTDIR\\app.ico"
  Delete "$INSTDIR\\.env.example"
  Delete "$INSTDIR\\Uninstall.exe"

  RMDir /r "$INSTDIR"

  DeleteRegKey HKLM "Software\\${APP_NAME}"
  DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}"
SectionEnd
