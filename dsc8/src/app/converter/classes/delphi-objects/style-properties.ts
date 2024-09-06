enum AlignOptions {
   alBottom = 0,
   alClient = 1,
   alCustom = 2,
   alLeft   = 3,
   alNone   = 4,
   alRight  = 5,
   alTop    = 6
};
enum AlignmentOptions {
   taCenter       = 0,
   taLeftJustify  = 1,
   taRightJustify = 2
};
interface AnchorsOptions {
   akLeft:   boolean;
   akTop:    boolean;
   akRight:  boolean;
   akBottom: boolean;
};
enum BiDiModeOptions {
   bdLeftToRight            = 0,
   bdRightToLeft            = 1,
   bdRightToLeftNoAlign     = 2,
   bdRightToLeftReadingOnly = 3
};
enum ColorOptions {
   clBlack = 0,
   clMaroon = 1,
   clGreen = 2,
   clOlive = 3,
   clNavy = 4,
   clPurple = 5,
   clTeal = 6,
   clGray = 7,
   clSilver = 8,
   clRed = 9,
   clLime = 10,
   clYellow = 11,
   clBlue = 12,
   clFuchsia = 13,
   clAqua = 14,
   clWhite = 15,
   clMoneyGreen = 16,
   clSkyBlue = 17,
   clCream = 18,
   clMedGray = 19,
   clActiveBorder = 20,
   clActiveCaption = 21,
   clAppWorkSpace = 22,
   clBackground = 23,
   clBtnFace = 24,
   clBtnHighlight = 25,
   clBtnShadow = 26,
   clBtnText = 27,
   clBtnCaptionText = 28,
   clDefault = 29,
   clGradientActiveCaption = 30,
   clGradientInactiveCaption = 31,
   clGrayText = 32,
   clHighlight = 33,
   clHighlightText = 34,
   clHotLight = 35,
   clInactiveBorder = 36,
   clInactiveCaption = 37,
   clInactiveCaptionText = 38,
   clInfoBk = 39,
   clInfoText = 40,
   clMenu = 41,
   clMenuBar = 42,
   clMenuHighlight = 43,
   clMenuText = 44,
   clNone = 45,
   clScrollBar = 46,
   cl3DDkShadow = 47,
   cl3DLight = 48,
   clWindow = 49,
   clWindowFrame = 50,
   clWindowText = 51
};
class CustomColor {
   private _value: string = '';
 
   constructor(value: string) {
     this.value = value;
   }
 
   get value(): string {
     return this._value;
   }
   set value(val: string) {
     this._value = '$' + val.padStart(8, '0');
   }
};
interface ConstraintsOptions {
   MaxHeight: number;
   MaxWidth:  number;
   MinHeight: number;
   MinWidth:  number;
};
enum CursorOptions {
   crAppStart = 0,
   crArrow = 1,
   crCross = 2,
   crDefault = 3,
   crDrag = 4,
   crHandPoint = 5,
   crHelp = 6,
   crHourGlass = 7,
   crHSplit = 8,
   crlBeam = 9,
   crMultiDrag = 10,
   crNo = 11,
   crNoDrop = 12,
   crSizeAll = 13,
   crSizeNESW = 14,
   crSizeNS = 15,
   crSizeNWSE = 16,
   crSizeWE = 17,
   crSQLWait = 18,
   crUpArrow = 19,
   crVSplit = 20
};
enum DragKindOptions {
   dkDock = 0,
   dkDrag = 1
};
enum DragModeOptions {
   dmAutomatic = 0,
   dmManual    = 1
};
enum FontCharsetOptions {
   ANSI_CHARSET = 0,
   ARABIC_CHARSET = 1,
   BALTIC_CHARSET = 2,
   CHINESEBIG5_CHARSET = 3,
   DEFAULT_CHARSET = 4,
   EASTEUROPE_CHARSET = 5,
   GB2312_CHARSET = 6,
   GREEK_CHARSET = 7,
   HANGEUL_CHARSET = 8,
   HEBREW_CHARSET = 9,
   JOHAB_CHARSET = 10,
   MAC_CHARSET = 11,
   OEM_CHARSET = 12,
   RUSSIAN_CHARSET = 13,
   SHIFTJIS_CHARSET = 14,
   SYMBOL_CHARSET = 15,
   THAI_CHARSET = 16,
   TURKISH_CHARSET = 17
};
enum FontNameOptions {
   '@Batang' = 0,
   '@BatangChe' = 1,
   '@DFKai-SB' = 2,
   '@Dotum' = 3,
   '@DotumChe' = 4,
   '@FangSong' = 5,
   '@Gulim' = 6,
   '@GulimChe' = 7,
   '@Gungsuh' = 8,
   '@GungsuhChe' = 9,
   '@KaiTi' = 10,
   '@Malgun Gothic' = 11,
   '@Meiryo' = 12,
   '@Meiryo UI' = 13,
   '@Microsoft JhengHei' = 14,
   '@Microsoft JhengHei Light' = 15,
   '@Microsoft JhengHei UI' = 16,
   '@Microsoft JhengHei UI Light' = 17,
   '@Microsoft YaHei' = 18,
   '@Microsoft YaHei Light' = 19,
   '@Microsoft YaHei UI' = 20,
   '@Microsoft YaHei UI Light' = 21,
   '@MingLiU' = 22,
   '@MingLiU_HKSCS' = 23,
   '@MingLiU_HKSCS-ExtB' = 24,
   '@MingLiU-ExtB' = 25,
   '@MS Gothic' = 26,
   '@MS Mincho' = 27,
   '@MS PGothic' = 28,
   '@MS PMincho' = 29,
   '@MS UI Gothic' = 30,
   '@NSimSun' = 31,
   '@PMingLiU' = 31,
   '@PMingLiU-ExtB' = 32,
   '@SimHei' = 33,
   '@SimSun' = 34,
   '@SimSun-ExtB' = 35,
   '@Yu Gothic' = 36,
   '@Yu Gothic Light' = 37,
   '@Yu Mincho' = 38,
   '@Yu Mincho Demibold' = 39,
   '@Yu Mincho Light' = 40,
   'Agency FB' = 41,
   'Aharoni' = 42,
   'Aldhabi' = 43,
   'Alef' = 44,
   'Algerian' = 45,
   'Amiri' = 46,
   'Amiri Quran' = 47,
   'Andalus' = 48,
   'Angsana New' = 49,
   'AngsanaUPC' = 50,
   'Aparajita' = 51,
   'Arabic Typesetting' = 52,
   'Arial' = 53,
   'Arial Black' = 54,
   'Arial Narrow' = 55,
   'Arial Rounded MT Bold' = 56,
   'Arimo' =57,
   'Baskerville Old Face' = 58,
   'Batang' = 59,
   'BatangChe' = 60,
   'Bauhaus 93' = 61,
   'Bell MT' = 62,
   'Berlin Sans FB' = 63,
   'Berlin Sans FB Demi' = 64,
   'Bernard MT Condensed' = 65,
   'Blackadder ITC' = 66,
   'Bodoni MT' = 67,
   'Bodoni MT Black' = 68,
   'Bodoni MT Condensed' = 69,
   'Bodoni MT Poster Compressed' = 70,
   'Book Antiqua' = 71,
   'Bookman Old Style' = 72,
   'Bookshelf Symbol 7' = 73,
   'Bradley Hand ITC' = 74,
   'Britannic Bold' = 75,
   'Broadway' = 76,
   'Browallia New' = 77,
   'BrowalliaUPC' = 78,
   'Brush Script MT' = 79,
   'Caladea' = 80,
   'Calibri' = 81,
   'Calibri Light' = 82,
   'Californian FB' = 83,
   'Calisto MT' = 84,
   'Cambria' = 85,
   'Cambria Math' = 86,
   'Candara' = 87,
   'Carlito' = 88,
   'Castellar' = 89,
   'Centaur' = 90,
   'Century' = 91,
   'Century Gothic' = 92,
   'Century Schoolbook' = 93,
   'Chiller' = 94,
   'Colonna MT' = 95,
   'Comic Sans MS' = 96,
   'Consolas' = 97,
   'Constantia' = 98,
   'Cooper Black' = 99,
   'Copperplate Gothic Bold' = 100,
   'Copperplate Gothic Light' = 101,
   'Corbel' = 102,
   'Cordia New' = 103,
   'CordiaUPC' = 104,
   'Courier' = 105,
   'Courier New' = 106,
   'Curlz MT' = 107,
   'DaunPenh' = 108,
   'David' = 109,
   'David CLM' = 110,
   'David Libre' = 111,
   'Default' = 112,
   'DejaVu Math TeX Gyre' = 113,
   'DejaVu Sans' = 114,
   'DejaVu Sans Condensed' = 115,
   'DejaVu Sans Light' = 116,
   'DejaVu Sans Mono' = 117,
   'DejaVu Serif' = 118,
   'DejaVu Serif Condensed' = 119,
   'DFKai-SB' = 120,
   'DilleniaUPC' = 121,
   'DokChampa' = 122,
   'Dotum' = 123,
   'DotumChe' = 124,
   'DS-Digital' = 125,
   'Dubai' = 126,
   'Dubai Light' = 127,
   'Dubai Medium' = 128,
   'Ebrima' = 130,
   'Edwardian Script ITC' = 131,
   'Elephant' = 132,
   'Engravers MT' = 133,
   'Eras Bold ITC' = 134,
   'Eras Demi ITC' = 135,
   'Eras Light ITC' = 136,
   'Eras Medium ITC' = 137,
   'Estrangelo Edessa' = 138,
   'EucrosiaUPC' = 139,
   'Euphemia' = 140,
   'FangSong' = 141,
   'Felix Titling' = 142,
   'Fixedsys' = 143,
   'Footlight MT Light' = 144,
   'Forte' = 145,
   'Frank Ruehl CLM' = 146,
   'Frank Ruhl Hofshi' = 147,
   'Franklin Gothic Book' = 148,
   'Franklin Gothic Demi' = 149,
   'Franklin Gothic Demi Cond' = 150,
   'Franklin Gothic Heavy' = 151,
   'Franklin Gothic Medium' = 152,
   'Franklin Gothic Medium Cond' = 153,
   'FrankRuehl' = 154,
   'FreesiaUPC' = 155,
   'Freestyle Script' = 156,
   'French Script MT' = 157,
   'Gabriola' = 158,
   'Gadugi' = 159,
   'Garamond' = 160,
   'Gautami' = 161,
   'Gentium Basic' = 162,
   'Gentium Book Basic' = 163,
   'Georgia' = 164,
   'Gigi' = 165,
   'Gill Sans MT' = 166,
   'Gill Sans MT Condensed' = 167,
   'Gill Sans MT Ext Condensed Bold' = 168,
   'Gill Sans Ultra Bold' = 169,
   'Gill Sans Ultra Bold Condensed' = 170,
   'Gisha' = 171,
   'Gloucester MT Extra Condensed' = 172,
   'Goudy Old Style' = 173,
   'Goudy Stout' = 174,
   'Gulim' = 175,
   'GulimChe' = 176,
   'Gungsuh' = 177,
   'GungsuhChe' = 178,
   'Haettenschweiler' = 179,
};
enum FontPitchOptions {
   fpDefault  = 0,
   fpFixed    = 1,
   fpVariable = 2
};
interface FontStyleOptions {
   fsBold:      boolean;
   fsItalic:    boolean;
   fsUnderline: boolean;
   fsStrikeOut: boolean;
};
interface FontOptions {
   Charset: FontCharsetOptions;
   Color:   ColorOptions | CustomColor;
   Height:  number
   Name:    FontNameOptions;
   Pitch:   FontPitchOptions;
   Size:    number;
   Style:   FontStyleOptions;
};
enum HelpTypeOptions {
   htContext = 0,
   htKeyword = 1
};
enum LayoutOptions {
   tlBottom = 0,
   tlCenter = 1,
   tlTop    = 2
};