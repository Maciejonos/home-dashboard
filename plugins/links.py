from microdot import Microdot, Request
from pydantic import BaseModel, HttpUrl, Field
from tinydb import TinyDB, where


class Link(BaseModel):
    url: HttpUrl
    name: str = Field(..., min_length=1)


class LinkPlugin:
    def __init__(self, app: Microdot):
        self.app = app
        app.get("/api/link")(self.get_links)
        app.put("/api/link")(self.put_link)
        app.delete("/api/link/<id>")(self.delete_link)

    def get_links(self, request: Request):
        with TinyDB("db.json") as db:
            links = db.table("links").all()

            return [
                {"id": link.doc_id, "name": link["name"], "url": link["url"]}
                for link in links
            ]

    def put_link(self, request: Request):
        with TinyDB("db.json") as db:
            links_table = db.table("links")
            data = request.json
            link = Link(**data)
            links_table.insert(
                link.model_dump(mode="json"),
            )
            return "", 204

    def delete_link(self, request: Request, id: str):
        with TinyDB("db.json") as db:
            links_table = db.table("links")
            links_table.remove(doc_ids=[int(id)])
            return "", 204
