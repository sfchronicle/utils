#!/usr/bin/env python

# I know this is crazy (and/or a security peril), but you can put code in this file that will run on the deploy engine when this gets deployed. This lets you do cool stuff like:
# - Add recent data to the project so clients don't have to make extra calls
# - Perform data manipulations so the downloaded file is small/clean
# - Run sanity checks prior to deployment -- if this file throws an error, the deploy will be halted

# NOTE: You can just straight up use varibles that are available the deploy engine's poll_s3.py script, even if we haven't declared anything here. Check out an example call to Slack:

app_sc.api_call(
	"chat.postMessage",
	channel=deploy_feed,
	text="*DEPLOY-ADDON.PY:* Hi! :sparkles:"
)