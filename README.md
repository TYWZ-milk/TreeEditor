# TreeEditor
## Learning mission
Start the TreeEditor project this week, make a tree editor, and plan to finish editing the main branches.

## Edit the main branch attribute
The editing of the main branches of individual trees has been completed, including the height, thickness, position, etc. of the main branches.

The leftmost column is the edit box for the main branch, including:

Background:The background color of the scene.

Segmentation:The number of segments when each ring sequence forming the main branches generates branches, the degree of fineness of the model can be adjusted by controlling the number of segments, and models with different fineness can be used for hierarchical details. The tentative value range is 0~30. The recommended value is higher than 20, and the tree model is more elaborate.

Number of circles:The number of rings in the arc sequence. This value mainly determines the height of the branches, and the tentative value ranges from 0 to 30.

Radiusof tree:The radius of the ring sequence. This value affects the thickness of the branches, and the tentative value ranges from 1 to 5.

Rebuild：Reshape the branches. After changing the above properties, click rebuild to get the corresponding changed branches.

Show branch：When the check box is selected, the tree model is displayed. When it is not checked, the ring sequence corresponding to the tree is displayed.

Show wireframe：When the check box is selected, the outline of the tree model but does not include the bark is displayed, it is convenient to directly observe the ring sequence.

Position：The location of the model in the scene.

There is also a column edit box for editing other branches of the tree.

## Edit ring sequence position
After the main branches are edited in size, thickness, etc., the shape of the main branches can be edited. The main method is to modify the position of the ring sequence in the scene. This method is convenient when checking the 'show wireframe'. Double-click a ring in the scene to move the ring at random, and then click rebuild in the edit box to get the modified tree shape. You can move multiple rings at once. However, the ring of the ring sequence is composed of branches of the tree model in order. It is not allowed to place the ring at a certain position above the position of the upper ring or the position of the ring below, otherwise it will be distorted. . The specific steps are：
* Check the 'show wireframe' to see the circular sequence position of the branches.
* Click on one of the rings to move.
* Click rebuild in the edit box to get the branch of the new shape.

## Problems

>At present, the editing function of the main branch of a tree has been completed. The problem lies in how to add and edit the child branches on the main branch. I have two options but each has its own advantages and disadvantages. I am still thinking about which one to choose or how to modify it.：
>>In the edit box above, modify the properties of the branches and click 'addbranch' to add a sub-branch to the scene, then manually drag the sub-branch to the specified position of the tree. The editable degree of freedom of this method is relatively high, and the branches of the generator can be dragged to any position, but the final tree model has low realism and cracks, and there may be a large gap between the branches after dragging and splicing. This method is less inclined because the realism is too low.

>>The second method is to add a sub-branch to the scene by clicking 'addbranch'. The sub-branch is randomly generated at a certain position of the main branch, and then the sub-branch can be edited, including editing of shape and size. The method solves the problem of the occurrence of gaps when the sub-branch is added in the previous method, but the disadvantage is that the position of the sub-branch is fixed in the random generation, and there is no way to modify it in the edit, so the editable degree of freedom of the tree decreases.


## Summary

The main problem encountered this week was how to add sub-branches. However, there is still a sequence problem in the project. The editing of the main branches should first adjust the height and thickness. After the determination, the ring sequence can be edited to modify the shape of the branches. After that, the height and thickness of the main branches cannot be modified, otherwise the trees obtained are inconsistent with the original.

The ring sequence information of the main branches in the project is saved in cs, and each time the modification in the edit box is recorded in the variable, then rebuild rebuilds the tree according to cs.
