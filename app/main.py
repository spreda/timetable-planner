from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.routing import Route, WebSocketRoute
import arel, os
import mimetypes

from database import engine, Base


custom_mimetype = mimetypes.add_type("application/javascript", ".js", True)

# Configure templates directory
templates = Jinja2Templates(directory="../frontend/templates")

DEBUG = os.getenv("DEBUG")
if _debug := DEBUG:
    hotreload = arel.HotReload(paths=[arel.Path("../frontend")])
    templates.env.globals["DEBUG"] = DEBUG
    templates.env.globals["hotreload"] = hotreload
    app = FastAPI(
        title="Schedule Planner",
        debug=True,
        routes=[WebSocketRoute("/hot-reload", hotreload, name="hot-reload")],
        on_startup=[hotreload.startup],
        on_shutdown=[hotreload.shutdown],
    )
else:
    app = FastAPI(title="Schedule Planner")

# Serve static pages
app.mount("/static", StaticFiles(directory="../frontend/static"), name="static")

# Create database tables
Base.metadata.create_all(bind=engine)

@app.get("/{page_name:path}", response_class=HTMLResponse)
async def render(page_name: str, request: Request):
    if page_name == "":
        page_name = "index.html"
    return templates.TemplateResponse(f"{page_name}", {"request": request}, mimetypes=custom_mimetype)

routes: list = [
    Route("/", render),
    Route("/{page:path}", render),
]

if DEBUG:
    routes += [
        WebSocketRoute("/hot-reload", hotreload, name="hot-reload"),
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, log_level="debug")