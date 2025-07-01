import psycopg2
import json
import os
import urllib.parse

def get_schema_info(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT table_schema, table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        ORDER BY table_schema, table_name, ordinal_position;
    """)
    rows = cur.fetchall()
    schema = {}
    for schema_name, table, column, dtype in rows:
        if schema_name not in schema:
            schema[schema_name] = {}
        if table not in schema[schema_name]:
            schema[schema_name][table] = []
        schema[schema_name][table].append({"column": column, "type": dtype})
    return schema

def main():
    # URL-encode the password to handle special characters
    password = urllib.parse.quote_plus("3zB8RLqFbTFYtoqE")
    database_url = f"postgresql://postgres:{password}@db.vkrpxixijyowlirbssxp.supabase.co:5432/postgres"
    
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(database_url)
        print("Connected successfully!")
        
        print("Fetching schema information...")
        schema = get_schema_info(conn)
        
        print("\n" + "="*50)
        print("SUPABASE DATABASE SCHEMA")
        print("="*50)
        print(json.dumps(schema, indent=2))
        
        conn.close()
        print("\nSchema introspection completed successfully!")
        
    except Exception as e:
        print(f"Error connecting to database: {e}")
        print("Please check your DATABASE_URL and try again.")
        print("\nAlternative: Please provide the exact connection string from your Supabase dashboard.")

if __name__ == "__main__":
    main() 