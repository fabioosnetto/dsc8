import pyautogui
from time import sleep
import utils
import pyperclip

import os
os.environ['TK_SILENCE_DEPRECATION'] = '1'
import tkinter as tk
from tkinter import messagebox

pyautogui.PAUSE = 0.2
tabs = 1
headerPanelTabIndex = -1 

def main():

   print('\n+' + ('-'*18) + '+')
   print(' Starting script... ')
   print('+' + ('-'*18) + '+\n')
   sleep(5)
   
   print(utils.getMousePos(0))

   # --- Full Auto Processes
   i = 0
   while(i < tabs):

      utils.selectUnit() # select unit
      utils.toggleDesignerTab() # open designer tab
      utils.selectForm() # select form

      # set form styles
      utils.selectObjectInspector()
      setFormStyles()
      
      # adds helper elements for preventing empty selection
      utils.addHelperElement('TLabel', 'TLabel__HelperElement_0000001')
      utils.addHelperElement('TRadioButton', 'TRadioButton__HelperElement_0000001')
      utils.addHelperElement('TCheckBox', 'TCheckBox__HelperElement_0000001')
      utils.addHelperElement('TEdit', 'TEdit__HelperElement_0000001')
      utils.addHelperElement('TMSEditSel', 'TMSEditSel__HelperElement_0000001')
      utils.addHelperElement('TComboBox', 'TComboBox__HelperElement_0000001')
      utils.addHelperElement('TMaskEdit', 'TMaskEdit__HelperElement_0000001')
      utils.addHelperElement('TMSDateEdit', 'TMSDateEdit__HelperElement_0000001')

      # set labels styles
      utils.selectElementsByType('TLabel')
      utils.selectObjectInspector()
      setLabelStyles()

      # set radio buttons styles
      utils.selectElementsByType('TRadioButton')
      utils.selectObjectInspector()
      setRadioButtonStyles()

      # set check boxes styles
      utils.selectElementsByType('TCheckBox')
      utils.selectObjectInspector()
      setCheckBoxStyles()

      # set fields styles
      utils.selectElementsByType('TEdit', 'TComboBox', 'TMaskEdit', 'TMSDateEdit')
      utils.selectObjectInspector()
      setFieldsStyles('all')

      utils.selectElementsByType('TEdit', 'TMaskEdit', 'TMSDateEdit')
      utils.selectObjectInspector()
      setFieldsStyles('TEdit', 'TMSEditSel', 'TMaskEdit', 'TMSDateEdit')
      
      utils.selectElementsByType('TEdit', 'TComboBox', 'TMaskEdit')
      utils.selectObjectInspector()
      setFieldsStyles('TEdit', 'TMSEditSel', 'TComboBox', 'TMaskEdit')
      
      # delete helper elements
      utils.delHelperElement()
      
      # set panels styles
      utils.selectElementsByType('TPanel')
      utils.selectObjectInspector()
      setPanelsStyles()

      # adds header panel
      addHeaderPanel(i, headerPanelTabIndex)
      
      utils.toggleDesignerTab() # close designer tab
      utils.selectUnit() # select unit
      utils.saveChanges() # save changes
      utils.nextTab() # next tab

      i = i+1

   print('\n+' + ('-'*16) + '+')
   print(' Ending script... ')
   print('+' + ('-'*16) + '+\n')
   


def setFormStyles():

   # set align
   utils.setStyle('Align', 'alNone')
   
   # set border style
   utils.setStyle('BorderStyle', 'bsNone')

   # set border width
   utils.setStyle('BorderWidth', '0')

   # set ctl3D
   utils.setStyle('Ctl3D', 'False')

   # set font
   utils.setFont()

   # set left
   utils.setStyle('Left', '400')

   # set position
   utils.setStyle('Position', 'poMainFormCenter')

   # set top
   utils.setStyle('Top', '200')

   # set width
   utils.setStyle('Width', '910')


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
   utils.selectUnit()
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
   utils.selectUnit()
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

def bringHeaderTitleToFront():
   pyautogui.hotkey('ctrl', 'h')
   pyautogui.rightClick(x=455, y=245)
   pyautogui.moveTo(x=540, y=275)
   sleep(0.8)
   pyautogui.click(x=700, y=280)

def addButtonsPanel():
   utils.selectForm()


def setLabelStyles():

   # set alignment
   utils.setStyle('Alignment', 'taLeftJustify')

   # set font
   utils.setFont(style='Negrito')

def setRadioButtonStyles():

   # set alignment
   utils.setStyle('Alignment', 'taRightJustify')

   # set font
   utils.setFont(style='Negrito')

def setCheckBoxStyles():

   # set alignment
   utils.setStyle('Alignment', 'taRightJustify')

   # set font
   utils.setFont(style='Negrito')

def setFieldsStyles(*args: str):

   # set bevel
   # BevelEdges
   if('all' in args):
      utils.setStyle('BevelEdges', '[beLeft,beTop,beRight,beBottom]')
      # BevelInner
      utils.setStyle('BevelInner', 'bvSpace')
      # BevelKind
      utils.setStyle('BevelKind', 'bkFlat')
      # BevelOuter
      utils.setStyle('BevelOuter', 'bvRaised')

   # set border
   if('TComboBox' not in args and 'all' not in args):
      utils.setStyle('BorderStyle', 'bsNone')

   # set ctl3D
   if('TMSDateEdit' not in args and 'all' not in args):
      utils.setStyle('Ctl3D', 'True')

   # set font
   if('all' in args):
      utils.setFont()

   # set height (20 and the 23 to update symbols size)
   utils.setStyle('Height', '20')
   utils.setStyle('Height', '23')

def setPanelsStyles():
   # set align
   utils.setStyle('Align', 'alTop')

   # set bevel
   # BevelInner
   utils.setStyle('BevelInner', 'bvNone')
   # BevelOuter
   utils.setStyle('BevelOuter', 'bvNone')
   
   # set border
   utils.setStyle('BorderStyle', 'bsNone')

   # set color
   utils.setStyle('Color', 'clWhite')

   # set ctl3D
   utils.setStyle('Ctl3D', 'False')

   # set font
   utils.setFont()



main()