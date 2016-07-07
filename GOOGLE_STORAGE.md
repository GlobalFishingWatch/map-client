# Google Storage usage commands

## Copy files

	gsutil -m -h "Cache-Control:public, max-age=XXXX" cp -r -a public-read <src> gs://<bucket-name>/<target folder>
	
## Set CORS permissions

First, a config file in JSON format is needed:

```
[
  {
    "origin": ["http://0.0.0.0:3000"],
    "responseHeader": ["Content-Type"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

Then run the following command:

	gsutil cors set <filename> gs://<bucket-name>
