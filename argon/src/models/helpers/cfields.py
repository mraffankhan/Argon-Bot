import json
from typing import Any, List, Optional
from tortoise.fields.base import Field


class ArrayField(Field, list):
    """
    A custom wrapper that handles both MySQL JSON fields and PostgreSQL native arrays.
    """
    
    def __init__(self, field: Field = None, **kwargs) -> None:
        super().__init__(**kwargs)
        self.sub_field = field

    @property
    def SQL_TYPE(self) -> str:
        from tortoise import Tortoise
        try:
            conn = Tortoise.get_connection("default")
            if "postgres" in conn.capabilities.dialect or "asyncpg" in conn.__class__.__name__.lower():
                # For PostgreSQL, use native arrays if possible, 
                # but since this is a custom field, we might stick to JSONB for simplicity 
                # unless we want to refactor everything to native arrays.
                # However, the user's previous schema used BIGINT[].
                # Let's try to detect if it's a BigIntField subfield.
                if self.sub_field and "BigInt" in self.sub_field.__class__.__name__:
                    return "BIGINT[]"
                return "TEXT[]"
            return "JSON"
        except:
            return "JSON"

    def to_python_value(self, value: Any) -> Optional[List[Any]]:
        if value is None:
            return None
        
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                # If it's not JSON, it might be a PostgreSQL array string representation 
                # (though asyncpg usually returns lists natively)
                return [value]
                
        if not isinstance(value, list):
            value = [value]
            
        if self.sub_field:
             return list(map(self.sub_field.to_python_value, value))
        return value

    def to_db_value(self, value: Any, instance: Any) -> Any:
        from pypika.terms import Term
        if value is None or isinstance(value, Term):
            return value
            
        if not isinstance(value, (list, tuple)):
            value = [value]
            
        if self.sub_field:
             value = [
                 val if isinstance(val, Term) else self.sub_field.to_db_value(val, instance) 
                 for val in value
             ]
             
        # Check if we are on PostgreSQL
        from tortoise import Tortoise
        try:
            conn = Tortoise.get_connection("default")
            if "postgres" in conn.capabilities.dialect or "asyncpg" in conn.__class__.__name__.lower():
                # For PostgreSQL, asyncpg accepts lists natively for array types
                return value
        except:
            pass

        return json.dumps(value)
