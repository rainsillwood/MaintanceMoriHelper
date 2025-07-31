# MaintenanceMoriHelper
 
 一个基于Maintenance Mori( https://mentemori.icu )的工具，需要安装TamperMonkey来使用，大部分已支持五种文字，小部分只有中文和英文，大陆地区使用需要开梯子来加载资源
 
 A tool based on Maintenance Mori( https://mentemori.icu ),You need a Browser plugin like Tamper Monkey to use it.Support EnUs/JaJp/KoKr/ZhCn/ZhTw

 如果长时间不工作，请查看控制台是否出错，没出错耐心等待一下，因为首次使用或者切换语言/游戏版本的时候会大量从服务器获取数据，需要时间处理，在完成之前不要关闭或刷新页面。如果出错，先尝试点击🔄（重新加载数据）或者🗑️（清除缓存），如果依然出错，请提交Issue

 If not work,please open development tool,and find if there are some error.if nothing wrong please dont close or refresh the page and wait a minute to complete data sync. If there is a error,first try click 🔄(force sync data again) or 🗑️(clear all data,inclue game data and cache data).If not work ,please start an issue.

 安装地址/URL：
 
稳定版/Stable：
    
    https://raw.githubusercontent.com/rainsillwood/MaintenanceMoriHelper/main/dist/MaintenanceMoriHelper.user.js
    
开发版/Nightly(Unrecommend)：
    
    https://raw.githubusercontent.com/rainsillwood/MaintenanceMoriHelper/main/extend/MaintenanceMoriHelper.user.js

# 功能介绍/Tips
 优化幻影神殿：显示具体获得报酬，更改显示模式（数据来源于旧版本，不一定准确）
 
 Better Temple:Show resources you'll get(Data get from old version,not really exact)

 优化竞技场/巅峰竞技场/通关记录：优化队伍及人物信息显示，现在你选中的队伍与人物信息可以驻留在窗口一直显示了

 Better Arena/Lengend/ClearParty：Now the team you selected and charatcer info panel will be pinned on the screen.And the information panel is moved to the right from bottom.All the information display is just like in game.

 数据转换：选择MessagePack格式的二进制文件（如游戏的MB文件，抓包发包的数据），自动转化为可读的JSON格式，可一次性多选

 Data Convert: Can convert MB Files or messagepack to JSON.
 
 战斗布局：选好区域、群组、等级（本地为Local）、世界（跨服为四个Block）后可以进行如下点击操作

 GvGMapper:
 
   从服务器获取：通过API从服务器获取地图信息

   Get from server:Get battle information from server
   
   从上一次恢复：从浏览器缓存恢复地图信息

   

   保存设置：以当前信息保存到浏览器缓存，包括公会颜色信息和城池信息

   表格中的第一列：点击可以设置公会代表色

   城池名称：添加Hint，格式为"你想说的话|想显示的图标代词"，不含引号，详见弹出的提示

   城池守方图标（盾）：显示进攻方

   城池攻方图标（剑）：隐藏进攻方

   城池攻防提示（顶部双剑）：反转攻守方（反击），且背景会显示为攻方公会颜色

   城池守方名称：更换守方公会，选好后按ESC确认

   城池攻方名称：更换攻方公会，选好后按ESC确认

   城池图片：无作用，但是背景会显示为守方公会颜色
