import pyautogui
from time import sleep
import utils
import pyperclip

import os
os.environ['TK_SILENCE_DEPRECATION'] = '1'
import tkinter as tk
from tkinter import messagebox

pyautogui.PAUSE = 0.3
tabs = 25
headerPanelTabIndex = -1 

def main():
   print()
   print('-'*20)
   print(' Starting script...')
   print('-'*20)
   print()
   sleep(5)

   print(utils.getMousePos(0))

   # --- Full Auto Processes
   i = 0
   while(i < tabs):

      # utils.clickUnitCode()
      # utils.toggleDesignerTab()
      # utils.openObjectInspector()
      # utils.selectForm()
      # fixHeaderPanel()
      # utils.toggleDesignerTab()
      # utils.clickUnitCode()
      # utils.saveChanges()
      # utils.nextTab()
      # i = i+1
      # continue

      #0 Enter/Select the delphi unit code
      utils.clickUnitCode()

      #1 - Enter a tab
      #utils.nextTab()

      #2 - Select the form
      utils.toggleDesignerTab()
      utils.openObjectInspector()
      utils.selectForm()

      #3 - Set the form width, left position, font and border
      setFormStyles()
      
      #5 - Select the labels, radio buttons, check boxes
      #6 - Set the labels styles, radio buttons styles, check boxes styles
      utils.addHelperElement('TLabel', '0000001')
      utils.addHelperElement('TLabel', '0000002')
      utils.selectLabels()
      setLabelStyles()
      utils.delHelperElement()

      utils.addHelperElement('TRadioButton', '0000001')
      utils.addHelperElement('TRadioButton', '0000002')
      utils.selectRadioButton()
      setRadioButtonStyles()
      utils.delHelperElement()

      utils.addHelperElement('TCheckBox', '0000001')
      utils.addHelperElement('TCheckBox', '0000002')
      utils.selectCheckBox()
      setCheckBoxStyles()
      utils.delHelperElement()

      #7 - Select the fields
      #8 - Set the fields styles
      utils.addHelperElement('TEdit', '0000001')
      utils.addHelperElement('TMSEditSel', '0000001')
      utils.addHelperElement('TComboBox', '0000001')
      utils.addHelperElement('TMaskEdit', '0000001')
      utils.addHelperElement('TMSDateEdit', '0000001')

      utils.selectFields('all')
      setFieldsStyles('all')

      utils.selectFields('TEdit TMSEditSel TMaskEdit TMSDateEdit')
      setFieldsStyles('TEdit TMSEditSel TMaskEdit TMSDateEdit')
      
      utils.selectFields('TEdit TMSEditSel TComboBox TMaskEdit')
      setFieldsStyles('TEdit TMSEditSel TComboBox TMaskEdit')
      
      utils.delHelperElement()
      
      #9 - Select the panels
      #10 - Set the panels styles
      utils.selectPanels()
      setPanelsStyles()

      #4 - Add the header panel and add the buttons panel
      addHeaderPanel(i, headerPanelTabIndex)
      #addButtonsPanel()

      #11 - Run to the next tab
      utils.toggleDesignerTab()
      utils.clickUnitCode()
      utils.saveChanges()
      utils.nextTab()

      i = i+1

   # # --- User Interaction Processes
   # i = 0
   # while(i < tabs):
      
   #    # request user to select fields and labels
   #    # left align, resize, vertical space
   #    # request user to put elements on the right colum and set labels/fields top on first row
      
   #    # request user to select left side labels
   #    # set labels vertical space
   #    # request user to select left side fields
   #    # set fields vertical space

   #    # request user to select right side labels
   #    # set labels vertical space
   #    # request user to select right side fields
   #    # set fields vertical space

   #    i = i+1

   print()
   print('-'*20)
   print(' Ending script...')
   print('-'*20)
   print()      
   


def setFormStyles():
   pyautogui.click(x=241, y=219) # scroll inspector to top

   # set alignment
   pyautogui.click(x=170, y=233)
   pyautogui.keyUp('fn')
   pyautogui.write('alNone')
   pyautogui.press('enter')
   
   # set border
   pyautogui.click(x=170, y=360)
   pyautogui.keyUp('fn')
   pyautogui.write('bsNone')
   pyautogui.press('enter')
   pyautogui.click(x=170, y=380)
   pyautogui.keyUp('fn')
   pyautogui.write('0')
   pyautogui.press('enter')

   # set ctl3D
   pyautogui.click(x=170, y=475)
   pyautogui.keyUp('fn')
   pyautogui.write('False')
   pyautogui.press('enter')

   # set font
   pyautogui.doubleClick(x=170, y=585)
   sleep(0.2)
   pyautogui.keyUp('fn')
   pyautogui.write('Segoe UI')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.write('Regular')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.write('9')
   pyautogui.press('enter')

   pyautogui.click(x=240, y=845) # scroll inspector to bottom

   # set left
   pyautogui.click(x=170, y=475)
   pyautogui.keyUp('fn')
   pyautogui.write('400')
   pyautogui.press('enter')

   # set position
   pyautogui.click(x=170, y=615)
   pyautogui.keyUp('fn')
   pyautogui.write('poMainFormCenter')
   pyautogui.press('enter')

   # set top
   pyautogui.click(x=170, y=730)
   pyautogui.keyUp('fn')
   pyautogui.write('200')
   pyautogui.press('enter')

   # set width
   pyautogui.click(x=170, y=825)
   pyautogui.keyUp('fn')
   pyautogui.write('910')
   pyautogui.press('enter')

   pyautogui.click(x=241, y=219) # scroll inspector to top

def fixHeaderPanel():
   pyautogui.click(x=30, y=40)
   pyautogui.keyUp('fn')
   pyautogui.hotkey('option', 'n', 's', interval=0.5) # select CnPack

   pyautogui.click(x=635, y=295) # disable type filter
   pyautogui.click(x=635, y=250) # enable filter by name
   pyautogui.doubleClick(x=710, y=275) # select filter by name
   pyautogui.keyUp('fn')
   pyautogui.write('PanelTitulo') # name to filter
   pyautogui.click(x=720, y=440) # select all
   pyautogui.click(x=635, y=295) # enable type filter
   pyautogui.click(x=635, y=250) # disable filter by name

   pyautogui.press('enter')

   # set bevel outer
   pyautogui.click(x=170, y=280)
   pyautogui.press('enter')
   pyautogui.keyUp('fn')
   pyautogui.write('bvNone')
   pyautogui.press('enter')
   

def addHeaderPanel(currTabPos: int, panelRefTabPos: int):

   # get title
   utils.selectForm()
   # pyautogui.click(x=241, y=219) # scroll inspector to top
   # pyautogui.click(x=170, y=395)
   # pyperclip.copy('')
   # pyautogui.press('enter')
   # pyautogui.hotkey('ctrl', 'c', interval=0.1)
   # sleep(1.2)
   # title = str(pyperclip.paste())
   # print('Panel Title: '+title)

   # get header panel
   # --- move to panel reference
   utils.toggleDesignerTab()
   utils.clickUnitCode()
   i = currTabPos
   while (i != panelRefTabPos):
      if (i > panelRefTabPos):
         utils.prevTab()
         i = i-1
      else:
         utils.nextTab()
         i = i+1


   # --- copy panel reference
   utils.toggleDesignerTab()
   pyautogui.click(x=920, y=240)         
   pyautogui.hotkey('ctrl', 'c')

   # set header panel
   # --- get back to current tab
   utils.toggleDesignerTab()
   utils.clickUnitCode()
   while (i != currTabPos):
      if (i < currTabPos):
         utils.nextTab()
         i = i+1
      else:
         utils.nextTab()
         i = i-1

   # --- paste the panel and set the title
   utils.toggleDesignerTab() # open designer form
   utils.selectForm() # select form
   utils.toggleDesignerTab() # toggle desigener tab again to set focus on it
   utils.toggleDesignerTab()
   pyautogui.hotkey('ctrl', 'v') # paste panel
   
   # pyautogui.click(x=520, y=245) # select panel title
   # pyautogui.click(x=170, y=280)
   # pyautogui.press('enter')
   # pyautogui.keyUp('fn')
   # pyautogui.write('Title') # rewrite title

def bringHeaderTitleToFront():
   pyautogui.hotkey('ctrl', 'h')
   pyautogui.rightClick(x=455, y=245)
   pyautogui.moveTo(x=540, y=275)
   sleep(0.8)
   pyautogui.click(x=700, y=280)

def addButtonsPanel():
   utils.selectForm()


def setLabelStyles():
   pyautogui.click(x=241, y=219) # scroll inspector to top
   pyautogui.click(x=170, y=200) # select first option

   # set alignment
   pyautogui.click(x=170, y=219)
   pyautogui.keyUp('fn')
   pyautogui.write('taLeftJustify')
   pyautogui.press('enter')

   # set font
   pyautogui.doubleClick(x=170, y=410)
   sleep(0.2)
   pyautogui.keyUp('fn')
   pyautogui.write('Segoe UI')
   pyautogui.press('tab')
   pyautogui.write('Negrito')
   pyautogui.press('tab')
   pyautogui.write('9')
   pyautogui.press('enter')

def setRadioButtonStyles():
   pyautogui.click(x=241, y=219) # scroll inspector to top
   pyautogui.click(x=170, y=200) # select first option

   # set alignment
   pyautogui.click(x=170, y=219)
   pyautogui.keyUp('fn')
   pyautogui.write('taRightJustify')
   pyautogui.press('enter')

   # set font
   pyautogui.doubleClick(x=170, y=410)
   sleep(0.2)
   pyautogui.keyUp('fn')
   pyautogui.write('Segoe UI')
   pyautogui.press('tab')
   pyautogui.write('Negrito')
   pyautogui.press('tab')
   pyautogui.write('9')
   pyautogui.press('enter')

def setCheckBoxStyles():
   pyautogui.click(x=241, y=219) # scroll inspector to top
   pyautogui.click(x=170, y=200) # select first option

   # set alignment
   pyautogui.click(x=170, y=219)
   pyautogui.keyUp('fn')
   pyautogui.write('taRightJustify')
   pyautogui.press('enter')

   # set font
   pyautogui.doubleClick(x=170, y=425)
   sleep(0.2)
   pyautogui.keyUp('fn')
   pyautogui.write('Segoe UI')
   pyautogui.press('tab')
   pyautogui.write('Negrito')
   pyautogui.press('tab')
   pyautogui.write('9')
   pyautogui.press('enter')

def setFieldsStyles(types: str):
   pyautogui.click(x=241, y=219) # scroll inspector to top
   pyautogui.click(x=170, y=200) # select first option

   # set bevel
   # BevelEdges
   if(types == 'all'):
      pyautogui.doubleClick(x=170, y=200)
      pyautogui.keyUp('fn')
      pyautogui.write('[beLeft,beTop,beRight,beBottom]')
      pyautogui.press('enter')
      # BevelInner
      pyautogui.click(x=170, y=221)
      pyautogui.keyUp('fn')
      pyautogui.write('bvSpace')
      pyautogui.press('enter')
      # BevelKind
      pyautogui.click(x=170, y=235)
      pyautogui.keyUp('fn')
      pyautogui.write('bkFlat')
      pyautogui.press('enter')
      # BevelOuter
      pyautogui.click(x=170, y=250)
      pyautogui.keyUp('fn')
      pyautogui.write('bvRaised')
      pyautogui.press('enter')

   # set border
   if('TComboBox' not in types and types != 'all'):
      pyautogui.click(x=170, y=300)
      pyautogui.keyUp('fn')
      pyautogui.write('bsNone')
      pyautogui.press('enter')

   # set ctl3D
   if('TMSDateEdit' not in types and types != 'all'):
      pyautogui.click(x=170, y=330)
      pyautogui.keyUp('fn')
      pyautogui.write('True')
      pyautogui.press('enter')

   # set font
   if(types == 'all'):
      pyautogui.doubleClick(x=170, y=313)
      sleep(0.2)
      pyautogui.keyUp('fn')
      pyautogui.write('Segoe UI')
      pyautogui.press('tab')
      pyautogui.keyUp('fn')
      pyautogui.write('Regular')
      pyautogui.press('tab')
      pyautogui.keyUp('fn')
      pyautogui.write('9')
      pyautogui.press('enter')

   # set height
   if(types == 'all'):
      pyautogui.click(x=170, y=330)
   elif(types == 'TEdit TMSEditSel TMaskEdit TMSDateEdit'):
      pyautogui.click(x=170, y=380)
   elif(types == 'TEdit TMSEditSel TComboBox TMaskEdit'):
      pyautogui.click(x=170, y=445)

   pyautogui.keyUp('fn')
   pyautogui.write('20')
   pyautogui.press('enter')
   pyautogui.write('23')
   pyautogui.press('enter')

def setPanelsStyles():
   pyautogui.click(x=241, y=219) # scroll inspector to top
   pyautogui.click(x=170, y=200) # select first option

   # set align
   pyautogui.doubleClick(x=170, y=200)
   pyautogui.keyUp('fn')
   pyautogui.write('alTop')
   pyautogui.press('enter')

   # set bevel
   # BevelInner
   pyautogui.click(x=170, y=265)
   pyautogui.keyUp('fn')
   pyautogui.write('bvNone')
   pyautogui.press('enter')
   # BevelOuter
   pyautogui.click(x=170, y=280)
   pyautogui.keyUp('fn')
   pyautogui.write('bvNone')
   pyautogui.press('enter')
   
   # set border
   pyautogui.click(x=170, y=325)
   pyautogui.keyUp('fn')
   pyautogui.write('bsNone')
   pyautogui.press('enter')

   # set color
   pyautogui.click(x=170, y=375)
   pyautogui.keyUp('fn')
   pyautogui.write('clWhite')
   pyautogui.press('enter')

   # set ctl3D
   pyautogui.click(x=170, y=395)
   pyautogui.keyUp('fn')
   pyautogui.write('False')
   pyautogui.press('enter')

   # set font
   pyautogui.doubleClick(x=170, y=505)
   sleep(0.2)
   pyautogui.keyUp('fn')
   pyautogui.write('Segoe UI')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.write('Regular')
   pyautogui.press('tab')
   pyautogui.keyUp('fn')
   pyautogui.write('9')
   pyautogui.press('enter')



main()