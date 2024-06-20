import pyautogui
from time import sleep

pyautogui.PAUSE = 0.2

# --- Get Mouse Position
def getMousePos(timeout = 10):
  sleep(timeout)
  return pyautogui.position()


# --- Click on Unit Code 
def selectUnit():
   pyautogui.click(x=700, y=400)

# --- Toggle Designer Tab
def toggleDesignerTab():
   pyautogui.hotkey('fn', 'F12')
   pyautogui.keyUp('fn')

# --- select Object Inspector
def selectObjectInspector():
   pyautogui.hotkey('option', 'v', 'w', interval=0.1)
   pyautogui.keyUp('fn')
   pyautogui.write('ObjectInspector')
   pyautogui.press('enter')

# --- Select the Form
def selectForm():

   # select CnPack > Form Design Wizard
   pyautogui.hotkey('option', 'n', 'z', interval=0.1)
   
   # select CnPack > Form Design Wizard > More...
   pyautogui.keyUp('fn')
   pyautogui.press('up')
   pyautogui.keyUp('fn')
   pyautogui.press('right')

   # select CnPack > Form Design Wizard > More... > Select Form
   pyautogui.keyUp('fn')
   pyautogui.press('down', presses=6)
   pyautogui.keyUp('fn')
   pyautogui.press('enter')


# --- Add Helper Element
def addHelperElement(elType: str, elID: str):
   
   pyautogui.hotkey('option', 'v', 'c', interval=0.1) # select View > Component List
   pyautogui.keyUp('fn')
   pyautogui.write(elType)

   pyautogui.keyUp('fn')
   pyautogui.press('enter')
   pyautogui.press('esc')
   selectObjectInspector()
   setStyle('Name', elID)
         
# --- Delete Helper Element
def delHelperElement(helperElDefID: str = 'HelperElement'):
   pyautogui.hotkey('option', 'n', 's', interval=0.1) # select CnPack > Component Selector

   # filter by name
   pyautogui.keyUp('fn')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.press('space')

   pyautogui.keyUp('fn')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.write(helperElDefID)

   # disable type filter
   pyautogui.keyUp('fn')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.press('space')

   # select all
   pyautogui.keyUp('fn')
   pyautogui.press('tab', presses=5)
   pyautogui.keyUp('fn')
   pyautogui.press('enter')

   # disable name filter (back to default)
   pyautogui.keyUp('fn')
   pyautogui.press('tab', presses=2)
   pyautogui.keyUp('fn')
   pyautogui.press('space')

   # enable type filter (back to default)
   pyautogui.keyUp('fn')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.press('space')

   pyautogui.press('enter')
   toggleDesignerTab()
   toggleDesignerTab()
   pyautogui.hotkey('ctrl', 'delete', interval=0.1)


# --- Select Element By Type
def selectElementsByType(*args: str):
   # select CnPack > Comoponent Selector
   pyautogui.hotkey('option', 'n', 's', interval=0.1)

   # for each type provided
   for type in args:
      
      # filter by type
      pyautogui.keyUp('fn')
      pyautogui.press('tab', presses=3)
      pyautogui.keyUp('fn')
      pyautogui.write(type)

      # select all
      pyautogui.keyUp('fn')
      pyautogui.press('tab', presses=6)
      pyautogui.keyUp('fn')
      pyautogui.press('enter')
      pyautogui.keyUp('fn')
      pyautogui.press('tab')

   # done
   pyautogui.keyUp('fn')
   pyautogui.press('enter')


# --- Set Style
def setStyle(styleName: str, styleValue: str):
   pyautogui.keyUp('fn')
   pyautogui.press('tab')

   pyautogui.keyUp('fn')
   pyautogui.write(styleName)
   
   pyautogui.keyUp('fn')
   pyautogui.press('enter')

   pyautogui.keyUp('fn')
   pyautogui.write(styleValue)

   pyautogui.keyUp('fn')
   pyautogui.press('enter')

# --- Set Font
def setFont(font: str = 'Segoe UI', style: str = 'Regular', size: str = '9'):
   setStyle('Font', '')

   pyautogui.keyUp('fn')
   pyautogui.hotkey('option', 'down')
   sleep(0.2)
   
   pyautogui.keyUp('fn')
   pyautogui.write(font)
   pyautogui.press('tab')

   pyautogui.keyUp('fn')
   pyautogui.write(style)
   pyautogui.press('tab')
   
   pyautogui.keyUp('fn')
   pyautogui.write(size)
   pyautogui.press('enter')


# --- Next Tab
def nextTab():
   pyautogui.hotkey('ctrl', 'tab')

# --- Previous Tab
def prevTab():
   pyautogui.hotkey('ctrl', 'shift', 'tab')

#--- Save Changes
def saveChanges():
   pyautogui.hotkey('option', 'f', 's', interval=0.1)
