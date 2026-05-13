import { Check, CheckItem } from "@/db/models";
import { NextResponse } from "next/server";
export async function GET(request) {
    try{ 
     const checks = await Check.findAll({ 
        include : [
            {
                model: CheckItem ,
                as: "items",
                where: { 
                    parent_id: null , 
                }, 
                required: false , 
                include : [
                    {
                        model: CheckItem , 
                        as: 'children'
                    }
                ] 
            },
        ], 
        
     })
      return NextResponse.json({checks}, {status: 200})
    }catch(err){ 
      return NextResponse.json({error_message : err.message}, {status: 500})
    }
}