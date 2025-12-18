import subprocess
from tinydb import TinyDB, where
from microdot import Microdot, Request
from pydantic import BaseModel, Field


class Service(BaseModel):
    name: str = Field(..., min_length=1)
    url: str | None = Field(default=None)
    sv_name: str = Field(..., min_length=1)


def check_service(name: str) -> bool:
    try:
        result = subprocess.run(
            ["systemctl", "is-active", name],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        return result.stdout.strip()
    except Exception:
        return False


class ServicePlugin:
    def __init__(self, app: Microdot):
        self.app = app
        app.put("/api/service")(self.put_service)
        app.delete("/api/service/<sv_name>")(self.delete_service)

    def put_service(self, request: Request):
        with TinyDB("db.json") as db:
            services_table = db.table("services")
            data = request.json
            service = Service(**data)
            services_table.insert(
                service.model_dump(mode="json"),
            )
            return "", 204

    def delete_service(self, request: Request, sv_name: str):
        with TinyDB("db.json") as db:
            services_table = db.table("services")
            service_id = services_table.get(where("sv_name") == sv_name).doc_id
            services_table.remove(service_id)
            return "", 204

    def get_payload(self):
        with TinyDB("db.json") as db:
            services = db.table("services").all()

            return [
                {
                    "name": service["name"],
                    "status": check_service(service["sv_name"]),
                    "url": service["url"] if service["url"] else None,
                    "sv_name": service["sv_name"],
                }
                for service in services
            ]
