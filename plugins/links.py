from microdot import Microdot, Request
from pydantic import BaseModel, HttpUrl, Field
from tinydb import TinyDB, where


class Link(BaseModel):
    url: HttpUrl
    name: str = Field(..., min_length=1)
    # icon: str = Field(..., min_length=1)


class LinkPlugin:
    def __init__(self, app: Microdot):
        self.app = app
        app.put("/api/links")(self.put_link)
        app.delete("/api/links/<hostname>")(self.delete_link)

    def get_links(self):
        with TinyDB("db.json") as db:
            links = db.table("links").all()

            return links
