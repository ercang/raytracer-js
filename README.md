# RayTracer.js
A simple ray tracer written in javascript with WebWorker support.

This is a hobby project which was based on the following tutorial.

https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-ray-tracing/implementing-the-raytracing-algorithm

### Folders
"./src" - Library source code

"./examples" - Example usages of this library

# Examples

A quick note, these test applications runs faster on firefox (than chrome).

### Example 1 - Simple Scene [640x480]

An example to demonstrate rendering capabilities.

https://ercang.github.io/raytracer-js/examples/example1.html

![Alt](https://ercang.github.io/raytracer-js/images/example1.png "Example 1 - Simple Scene [640x480]")


### Example 2 - Animated Scene [320x240]

An example to measure performance. Browser tries to render frames as quickly as it can, using the main javascript thread.

https://ercang.github.io/raytracer-js/examples/example2.html

![Alt](https://ercang.github.io/raytracer-js/images/example2.png "Example 2 - Animated Scene [320x240]")


### Example 3 - Animated Scene with WebWorkers (Multi Threaded) [320x240]

An example to measure web worker performance. Browser tries to render frames as quickly as it can, using 4 WebWorker.

https://ercang.github.io/raytracer-js/examples/example3.html

![Alt](https://ercang.github.io/raytracer-js/images/example3.png "Example 3 - Animated Scene with WebWorkers (Multi Threaded) [320x240]")

# RayTracer.js API
### Scene
```
new Scene()
```
Creates a new scene.

```
add(element)
```
Adds the specified element to the scene.

```
Array getElements()
```
Returns element array.

```
clear()
```
Removes all elements from the scene.

### Sphere
```
new Sphere(Vector3 center, Number radius, Material material)
```
Creates a new sphere.

```
bool intersect(Vector3 rayOrigin, Vector3 rayDir, out)
```
Intersects the sphere with the given ray.
Out parameters are can be read as out.t0 and out.t1

```
Vector3 getCenter()
```
Returns center point.

```
Number getRadius()
```
Returns radius.

```
Material getMaterial()
```
Returns material.

```
Vector3 getNormal(Vector3 point)
```
Returns normal at the given point. Point must be in world coordinates.

```
JSONObject serialize()
```
Returns a json object with serialized data.

```
Sphere deserialize(JSONObject data)
```
Returns a new sphere object which is deserialized from the given data.

### Material
```
new Material(Vector3 surfaceColor, Number reflection, Number transparency, Vector3 emissionColor)
```
Creates a new material with the specified parameters.
Parameter range is between 0 and 1.
Emission color is used for lights.

```
Vector3 surfaceColor
Number reflection
Number transparency
Vector3 emissionColor
```

### Vector3
```
new Vector3(Number x, Number y, Number z)
```
Creates a new Vector3

```
Vector3 clone()
```
Copies the vector3 and returns a new one.

```
Number length2()
Number length()
Vector3 normalize()
Vector3 dotProduct(Vector3 vec)
Vector3 product(Vector3 vec)
Vector3 multiply(Number scalarValue)
Vector3 add(Vector3 vec)
Vector3 subtract(Vector3 vec)
Vector3 revert()
```

### RayTracer
```
new RayTracer(Vector3 backgroundColor, Scene scene)
```
Creates a new RayTracer for the specified scene

```
Vector3 trace(Vector3 rayOrigin, Vector3 rayDir, depth)
```
Shoots the ray and returns the color.

```
ArrayBuffer render(Number width, Number height, Number startY, Number scanHeight)
```
Renders the specified part of the screen and returns the image buffer in RGBA order.

### RenderPlanner
```
new RenderPlanner(Number jobCount, Scene scene, Vector3 backgroundColor, Number width, Number height)
```
Creates a new render planner for the scene and target resolution. JobCount is the WebWorker count that will be created.

```
initialize()
```
Creates all workers and prepares them for rendering.

```
start()
```
Starts all workers to render.

```
isRunning()
```
Returns true if rendering is not completed yet.

```
updateScene()
```
If scene is updated, this function should be called to notify WebWorkers.

```
onUpdateReceived(Number sectionStart, Number sectionHeight, Uint8ClampedArray buf8)
```
Callback function to notify a frame update is ready to collect.
sectionStart is the y component, sectionHeight is the height component.

### RenderWorker
This class is used internally by RenderPlanner. This worker saves a copy of the scene and renders a part of the buffer.
When rendering is completed it notifies the RenderPlanner. RenderWorker accpets the following messages

```
{"action": "elements",
"data": [SerializedElementsDataArray]}
```
Sets the scene

 ```
{"action": "backgroundColor",
"data": [red, green, blue]}
```
Sets the background color

```
{"action": "dimensions",
"data": [width, height, startY, scanHeight]}
```
Sets the dimensions of the image

```
{"action": "render"}
```
Starts rendering

When WebWorker finished, it sends the following message
```
{"action": "result",
"data": [Uint8ClampedArray]}
```
