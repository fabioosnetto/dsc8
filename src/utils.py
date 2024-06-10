import pyautogui
from time import sleep
from enum import Enum

pyautogui.PAUSE = 0.3

# --- Get Mouse Position
def getMousePos(timeout = 10):
  sleep(timeout)
  return pyautogui.position()


# --- Click on Unit Code 
def clickUnitCode():
   pyautogui.click(x=700, y=400)
   

# --- Next Tab
def nextTab():
   pyautogui.hotkey('ctrl', 'tab')

# --- Previous Tab
def prevTab():
   pyautogui.hotkey('ctrl', 'shift', 'tab')


# --- Toggle Designer Tab
def toggleDesignerTab():
   pyautogui.hotkey('fn', 'F12')
   pyautogui.keyUp('fn')


# --- Add Helper Element
def addHelperElement(elOpt: str, id: str):
   
   if(elOpt == 'TLabel'):
      pyautogui.click(x=345, y=65) # select standard element
      pyautogui.click(x=397, y=95) # select TLabel
      pyautogui.click(x=415, y=235) # put element
     
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=555) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

   elif(elOpt == 'TRadioButton'):
      pyautogui.click(x=345, y=65) # select standard element
      pyautogui.click(x=540, y=95) # select TRadioButton
      pyautogui.click(x=415, y=235) # put element
     
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=540) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

   elif(elOpt == 'TCheckBox'):
      pyautogui.click(x=345, y=65) # select standard element
      pyautogui.click(x=510, y=95) # select TCheckBox
      pyautogui.click(x=415, y=235) # put element
      
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=555) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

   elif(elOpt == 'TEdit'):
      pyautogui.click(x=345, y=65) # select standard element
      pyautogui.click(x=425, y=95) # select TEdit
      pyautogui.click(x=415, y=235) # put element
      
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=665) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

   elif(elOpt == 'TMSEditSel'):
      pyautogui.click(x=1435, y=65, clicks=24, interval=0.1) # scroll to MJS element
      pyautogui.click(x=1335, y=65) # select MJS element
      pyautogui.click(x=480, y=95) # select TMSEditSel
      pyautogui.click(x=415, y=235) # put element
      
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=855) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

      pyautogui.click(x=1415, y=65, clicks=24, interval=0.1) # scroll to MJS element
      pyautogui.click(x=345, y=65) # select standard element

   elif(elOpt == 'TComboBox'):
      pyautogui.click(x=345, y=65) # select standard element
      pyautogui.click(x=595, y=95) # select TComboBox
      pyautogui.click(x=415, y=235) # put element
      
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=715) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

   elif(elOpt == 'TMaskEdit'):
      pyautogui.click(x=285, y=65) # select additional element
      pyautogui.click(x=370, y=95) # select TMaskEdit
      pyautogui.click(x=415, y=235) # put element
      
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=685) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

   elif(elOpt == 'TMSDateEdit'):
      pyautogui.click(x=1435, y=65, clicks=24, interval=0.1) # scroll to MJS element
      pyautogui.click(x=1335, y=65) # select MJS element
      pyautogui.click(x=875, y=95) # select TMSDateEdit
      pyautogui.click(x=415, y=235) # put element
      
      # set name
      pyautogui.click(x=240, y=215) # scroll top
      pyautogui.click(x=170, y=200) # select first style option
      pyautogui.click(x=170, y=555) # select name option
      pyautogui.keyUp('fn')
      pyautogui.write(elOpt+id+'HelperElement')

      pyautogui.click(x=1415, y=65, clicks=24, interval=0.1) # scroll to MJS element
      pyautogui.click(x=345, y=65) # select standard element
         
# --- Delete Helper Element
def delHelperElement():
   pyautogui.click(x=30, y=40)
   pyautogui.hotkey('option', 'n', 's', interval=0.5) # select CnPack

   pyautogui.click(x=635, y=295) # disable type filter
   pyautogui.click(x=635, y=250) # enable filter by name
   pyautogui.doubleClick(x=710, y=275) # select filter by name
   pyautogui.write('HelperElement') # name to filter
   pyautogui.click(x=720, y=440) # select all
   pyautogui.click(x=635, y=295) # enable type filter
   pyautogui.click(x=635, y=250) # disable filter by name
   
   pyautogui.press('enter')
   toggleDesignerTab()
   toggleDesignerTab()
   pyautogui.hotkey('ctrl', 'delete', interval=0.1)


# --- Select the Form
def selectForm():

   # select CnPack
   pyautogui.click(x=30, y=40)
   pyautogui.keyDown('option')
   pyautogui.press('n')

   # select Form Design Wizard
   pyautogui.press('z')
   sleep(0.5)

   # select more
   pyautogui.moveTo(x=835, y=715)
   pyautogui.keyUp('option')
   sleep(0.5)

   # select form
   pyautogui.keyUp('fn')
   pyautogui.press('down', presses=7)
   pyautogui.press('enter')

   # pyautogui.click(x=20, y=150, clicks=1)
   # pyautogui.press('f')
   # pyautogui.press('enter')

# --- Select Labels 
def selectLabels():
   pyautogui.click(x=30, y=40)
   pyautogui.hotkey('option', 'n', 's', interval=0.5) # select CnPack

   # remove name filter
   pyautogui.doubleClick(x=415, y=235)
   pyautogui.press('delete')

   # filter labels
   pyautogui.click(x=835, y=315)
   pyautogui.keyUp('fn')
   pyautogui.write('TLabel', interval=0.1)
   pyautogui.press('enter')
   
   pyautogui.click(x=720, y=440) # select all

   # # remove title label
   # pyautogui.click(x=765, y=405)
   # pyautogui.hotkey('ctrl', 'alt', 'end', interval=0.1)
   # pyautogui.hotkey('fn', 'up', interval=0.1)
   # pyautogui.hotkey('fn', 'up', interval=0.1)
   # pyautogui.click(x=720, y=465)
   pyautogui.press('enter')

# --- Select Radio Buttons 
def selectRadioButton():
   pyautogui.click(x=30, y=40)
   pyautogui.hotkey('option', 'n', 's', interval=0.5) # select CnPack

   # remove name filter
   pyautogui.doubleClick(x=415, y=235)
   pyautogui.press('delete')

   # filter labels
   pyautogui.click(x=835, y=315)
   pyautogui.keyUp('fn')
   pyautogui.write('TRadioButton', interval=0.1)
   pyautogui.press('enter')
   
   pyautogui.click(x=720, y=440) # select all
   pyautogui.press('enter')

# --- Select Check Boxes
def selectCheckBox():
   pyautogui.click(x=30, y=40)
   pyautogui.hotkey('option', 'n', 's', interval=0.5) # select CnPack

   # remove name filter
   pyautogui.doubleClick(x=415, y=235)
   pyautogui.press('delete')

   # filter labels
   pyautogui.click(x=835, y=315)
   pyautogui.keyUp('fn')
   pyautogui.write('TCheckBox', interval=0.1)
   pyautogui.press('enter')
   
   pyautogui.click(x=720, y=440) # select all
   pyautogui.press('enter')

# --- Select Fields 
def selectFields(type: str):
   pyautogui.click(x=30, y=40)
   pyautogui.hotkey('option', 'n', 's', interval=0.5) # select CnPack

   # remove name filter
   pyautogui.doubleClick(x=415, y=235)
   pyautogui.press('delete')

   # filter fields
   if(type == 'all' or 'TEdit' in type):
      pyautogui.click(x=835, y=315)
      pyautogui.keyUp('fn')
      pyautogui.write('TEdit', interval=0.1)
      pyautogui.press('enter')
      pyautogui.click(x=720, y=440) # select all

   if(type == 'all' or 'TMSEditSel' in type):
      pyautogui.click(x=835, y=315)
      pyautogui.keyUp('fn')
      pyautogui.write('TMSEditSel', interval=0.1)
      pyautogui.press('enter')
      pyautogui.click(x=720, y=440) # select all

   if(type == 'all' or 'TComboBox' in type):
      pyautogui.click(x=835, y=315)
      pyautogui.keyUp('fn')
      pyautogui.write('TComboBox', interval=0.1)
      pyautogui.press('enter')
      pyautogui.click(x=720, y=440) # select all

   if(type == 'all' or 'TMaskEdit' in type):
      pyautogui.click(x=835, y=315)
      pyautogui.keyUp('fn')
      pyautogui.write('TMaskEdit', interval=0.1)
      pyautogui.press('enter')
      pyautogui.click(x=720, y=440) # select all

   if(type == 'all' or 'TMSDateEdit' in type):
      pyautogui.click(x=835, y=315)
      pyautogui.keyUp('fn')
      pyautogui.write('TMSDateEdit', interval=0.1)
      pyautogui.press('enter')
      pyautogui.click(x=720, y=440) # select all

   pyautogui.press('enter')

# --- Select Panels 
def selectPanels():
   pyautogui.click(x=30, y=40)
   pyautogui.hotkey('option', 'n', 's', interval=0.5) # select CnPack

   # remove name filter
   pyautogui.doubleClick(x=415, y=235)
   pyautogui.press('delete')

   # filter fields
   pyautogui.click(x=835, y=315)
   pyautogui.keyUp('fn')
   pyautogui.write('TPanel', interval=0.1)
   pyautogui.press('enter')
   pyautogui.click(x=720, y=440) # select all
   pyautogui.press('enter')


# --- Open Object Inspector
def openObjectInspector():
   pyautogui.click(x=30, y=40)
   pyautogui.hotkey('option', 'v', 'o', interval=0.1)

#--- Save Changes
def saveChanges():
   pyautogui.click(x=90, y=65)
