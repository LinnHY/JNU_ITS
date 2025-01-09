# **《编译原理》课程智能导学系统设计与实现 — 解题工具与知识追踪模块**

解题工具是智能导学系统的重要组成模块，致力于为学生提供解题指导，通过解题的方式检验其学习效果，实现对综合运用知识能力的培养。本文以《编译原理》课程为例，设计及开发了辅助课程教学的解题工具。该工具实现了教师拖拽自定义组件出题、教师定义步骤与提示、学生做题和动态展示学生知识水平的功能。



**题板设置**：

针对不同题目，教师拖拽答题板所需的各个部件，例如表格、文本框、图片、各类 SVG 图形和数学符号等，采用拖拽的方式将各个题目所需的部件加入到题板中。

题板布局如下图所示：

![image](https://github.com/user-attachments/assets/75e703ac-22ba-4c6a-9a0c-6daf04579857)


输入题目功能图示：

![image](https://github.com/user-attachments/assets/40269f99-0cf2-420d-99b5-c0f51532cb4d)


选择题目功能：
![image](https://github.com/user-attachments/assets/753f3cbd-45b6-4e61-95dc-3911d4728389)

修改题目功能：
![image](https://github.com/user-attachments/assets/8557fe33-dad7-42db-a06e-5699ba5e0f82)



右击组件设置答题步骤：
![image](https://github.com/user-attachments/assets/963ac7ba-f010-4ffa-8ee3-7827fd1adfee)

设置逻辑步：在若干步骤中，某些步骤之间存在着先后顺序，这些存在先后顺序的步骤被称为逻辑步，后面的逻辑步必须等先前的逻辑步完成后才能被操作。
同样的，对于逻辑步的设置，也是通过右击组件选择“设为逻辑步x”，请注意若一个组件被设为逻辑步，则其会自动变成一个步骤。

设置答案：若教师需要对某道题设置答案，则需要与学生做题的流程一样，先选择目标题目，完成题目。
![image](https://github.com/user-attachments/assets/5639b005-c53f-40d4-b51a-bc88ba3b6247)

数据库E-R图：
![image](https://github.com/user-attachments/assets/16d9a18b-2e52-471b-a533-52aa8d48d6cd)

