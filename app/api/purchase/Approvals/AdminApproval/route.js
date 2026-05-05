import { Purchase } from "@/db/models";
import { GetSpecificRequest } from "@/functions/purchase";
import { NextResponse } from "next/server";

export async function GET(request) {
    const url = new URL(request.url); 
    const searchParams = url.searchParams; 
    const page = parseInt(searchParams.get("page")) || 1; 
    const limit = parseInt(searchParams.get("limit")) || 10;  
    return await GetSpecificRequest("Admin",searchParams.get('dateStart'), searchParams.get("dateEnd"), page, limit); 
}
export async function POST(request) {
    try{ 
    
        const url = new URL(request.url); 
        const searchParams = url.searchParams; 
        const body = await request.json(); 
        const id = searchParams.get("PRID"); 
        if(!body.e_sign){
           return NextResponse.json({error_message : "No e-sign"} , {status: 401})
        }
         const purchase = await Purchase.findByPk(id); 
        if(!purchase){ 
            return NextResponse.json({error_message: "Record Not Found"}, {status: 404}); 
        }
        //update 
        await purchase.update({AdminSign: body.e_sign}) 
        return NextResponse.json({message: `You Approved Purchase Requesition: ${id}`}, {status: 200})
    }catch(error){ 
       return NextResponse.json({error_message: error.message}, {status: 500})
    }
}