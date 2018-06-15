# RadialSpriteSheetGenerator

<p align="center">
  <img src="https://thumbs.gfycat.com/WindingAppropriateCollardlizard-size_restricted.gif" alt="Thinking">
</p>

This is a web app that generates radial progress indicator sprite sheets right in the browser.

<https://eryn.io/RadialSpriteSheetGenerator/>

## Use in Roblox
For ease of use in Roblox, a module is provided that can take in configuration the web app provides and can make an ImageLabel or ImageButton display your progress indicator with little work.

To get prepped, follow these instructions:

1. To get the module, save it from [here](https://raw.githubusercontent.com/evaera/RadialSpriteSheetGenerator/master/roblox/RadialImage.lua) and then put it in your game as a ModuleScript.
	1. The demo below assumes you put the module into ReplicatedStorage named "RadialImage".
2. Use the web app to generate your sprite sheets and configuration JSON. Upload the images to Roblox.
	1. Make sure you tick the "Use in Roblox" checkbox before copying the JSON.
3. Modify the JSON, replacing the number part of `rbxassetid://1` with the Image ID of the first image you uploaded (and likewise for any additional images).
4. Store the JSON in your Roblox game, either as a StringValue or embedded in a script somewhere.
	1. The demo below assumes you put the JSON into a StringValue named "Configuration" inside the script that's running.

```lua
-- For the purposes of this demo, the script is located inside of an ImageLabel.
-- Make sure you update the following line to point to wherever you added the module in your game:
local RadialImage = require(game:GetService("ReplicatedStorage"):WaitForChild("RadialImage"))
local r = RadialImage.new(script.Configuration.Value, script.Parent)

game:GetService("RunService").Heartbeat:Connect(function()
	r:UpdateLabel(tick() % 5 / 5)
end)
```

### API

```cs
RadialImage RadialImage.new (<string, table> configuration [, <ImageLabel | ImageButton> label])
  /// Instantiates a new instances of RadialImage.
  // @param configuration Expects a valid configuration generated from the web app, in either JSON or table form.
  // @param label Optional, provides a label to be used with the UpdateLabel method. If this is omitted, you must pass it as the second argument to UpdateLabel.
  // @returns RadialImage A newly-created RadialImage instance.
```

```cs
void RadialImage:UpdateLabel (number alpha [, <ImageLabel | ImageButton> label])
  /// Updates an ImageLabel or ImageButton to show the most appropriate frame based on the current progress.
  // @param alpha A number between 0 and 1 that indicates how far along the progress is. The label will then display the most appropriate image based on the number of available images in the sprite sheet.
  // @param label Optional, allows you to pass in a custom label to do the update operation on. Required if `label` is omitted from the instantiation.
```

```cs
<number X, number Y, number ImageIndex> RadialImage:GetFromAlpha (number alpha)
  /// Returns the information necessary to display the appropriate image from the sprite sheet.
  // @param alpha A number between 0 and 1 that indicates how far along the progress is. Information for the most appropriate frame will be returned based on the number of available images in the sprite sheet.
  // @returns <number, number, number> Returns the X coordinate, Y coordinate, and the Image number for which to display based on the given alpha.
```
