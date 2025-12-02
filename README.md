


## Step 1: Start the Fast API REST API

```sh
# Download the zip file

# In the backend file:
# Create Environment
cd Backend
python -m venv venv

# Enable it
cd Backend
source venv/bin/activate

# Install dependencies
cd Backend
pip install "fastapi[standard]"

# Start server
cd Backend
fastapi dev restapi.py
```


# In the frontend file:
## Step 2: Start Metro
Plug your phone, or emulator.
First, you will need to run **Metro**, the JavaScript build tool for React Native.

```sh
# Using npm
cd Frontend 
npm start
```

## Step 3: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

```sh
# Using npm
cd Frontend
npm run android
# It might take a long time on the first launch, which is because of the MapBox library and the reanimated library
```
