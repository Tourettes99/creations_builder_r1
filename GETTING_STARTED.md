# Getting Started with R1 Creations Builder

Welcome to the R1 Creations Builder! This guide will help you create your first R1 creation using visual programming.

## Installation & Launch

1. **Install the package:**
   ```bash
   pip install creations-builder
   ```

2. **Launch the builder:**
   ```bash
   creations-builder
   ```
   
   This opens the visual interface in your browser at `http://localhost:5000`

## Your First Creation

Let's create a simple voice-activated greeting:

### Step 1: Start with a Template
1. Click the **"Templates"** button in the header
2. Select **"Hello World"** from the beginner category
3. Click to load the template

### Step 2: Customize the Creation
1. Change the creation name from "Hello World" to "My First Creation"
2. In the workspace, click on the voice command block
3. Change "hello" to "greetings" 
4. Click on the speak block and change the message to "Greetings, human!"

### Step 3: Preview Your Creation
1. Click the **"Preview"** button
2. In the simulator, click **"Voice Command"**
3. Type "greetings" when prompted
4. Watch your creation respond!

### Step 4: Export for R1 Device
1. Click the **"Export"** button
2. Choose **"HTML Bundle"**
3. Save the file to your computer
4. Transfer to your R1 device

## Understanding Blocks

### 🎯 Trigger Blocks (Green)
These start your creation when something happens:
- **Voice Command**: Responds to spoken words
- **Timer**: Runs at regular intervals
- **Hardware Button**: Reacts to device buttons
- **Accelerometer**: Detects movement/tilt

### ⚡ Action Blocks (Blue)
These make things happen:
- **Send Notification**: Shows messages
- **Speak Text**: Uses R1's voice
- **Web Request**: Calls external APIs
- **Store Data**: Saves information

### 🧠 Logic Blocks (Purple)
These control program flow:
- **Wait**: Pauses execution
- **If/Else**: Makes decisions
- **Math**: Performs calculations
- **Variables**: Stores values

## Building Logic Flows

### Simple Flow
```
[Voice Command: "timer"] → [Speak: "Timer started"] → [Wait: 5 seconds] → [Speak: "Time's up!"]
```

### Conditional Flow
```
[Timer: every 1 hour] → [If accelerometer detects movement] → [Speak: "Time to stretch!"]
                      → [Else] → [Send notification: "Still sitting?"]
```

### Data Storage
```
[Voice Command: "remember"] → [Store Data: "user_preference" = "coffee"]
[Voice Command: "what do I like"] → [Speak: stored value]
```

## Tips for Success

### 1. Start Simple
- Begin with basic voice commands
- Add one feature at a time
- Test frequently in preview mode

### 2. Use Templates
- Templates provide working examples
- Modify templates rather than starting from scratch
- Study how templates connect blocks

### 3. Understand R1 Constraints
- Screen size: 240x282 pixels
- Limited processing power
- Battery considerations
- Hardware button limitations

### 4. Test Thoroughly
- Use the preview simulator
- Test all trigger conditions
- Verify error handling

### 5. Organize Your Blocks
- Use the cleanup tool to arrange blocks
- Group related functionality
- Add comments for complex logic

## Common Patterns

### Voice-Activated Assistant
```
[Voice: "weather"] → [Web Request: weather API] → [Speak: weather info]
[Voice: "time"] → [Speak: current time]
[Voice: "remind me"] → [Store: reminder] → [Timer: reminder time] → [Speak: reminder]
```

### Motion-Based Controller
```
[Tilt Left] → [Send notification: "Left turn"]
[Tilt Right] → [Send notification: "Right turn"]
[Shake detection] → [Speak: "Stop shaking me!"]
```

### Productivity Timer
```
[Voice: "start work"] → [Store: start_time] → [Timer: 25 minutes] → [Speak: "Break time!"]
[Voice: "break"] → [Timer: 5 minutes] → [Speak: "Back to work!"]
```

## Keyboard Shortcuts

- **Ctrl+N**: New creation
- **Ctrl+S**: Save creation
- **Ctrl+O**: Open templates
- **Ctrl+E**: Quick export
- **Ctrl+P**: Preview creation
- **Esc**: Close modals

## Troubleshooting

### Blocks Won't Connect
- Check block types (triggers only connect to actions)
- Ensure proper block shapes match
- Try zooming in for precision

### Preview Not Working
- Check browser popup blocker
- Ensure JavaScript is enabled
- Try refreshing the page

### Export Fails
- Verify workspace has blocks
- Check creation name is valid
- Try different export format

### Code Not Generating
- Check all blocks are connected
- Verify required fields are filled
- Look for error messages in browser console

## Next Steps

1. **Explore Templates**: Try different categories
2. **Read Documentation**: Check the full README
3. **Join Community**: Share your creations
4. **Advanced Features**: Learn custom block creation

## Need Help?

- 📖 **Full Documentation**: README.md
- 🐛 **Report Issues**: GitHub Issues
- 💬 **Ask Questions**: GitHub Discussions
- 📧 **Contact**: dev@example.com

Happy creating! 🎉
