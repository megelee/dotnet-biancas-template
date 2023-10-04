using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BiancasBikes.Data;
using Microsoft.EntityFrameworkCore;
using BiancasBikes.Models;

namespace BiancasBikes.Controllers;

// controller is a class. A controller class contains methods that are the handlers for the endpoints of the API.
    // the controllers inherit many of the properties and methods we will use from the ControllerBase class.
[ApiController]
[Route("api/[controller]")]
public class BikeController : ControllerBase
{
    private BiancasBikesDbContext _dbContext;

    public BikeController(BiancasBikesDbContext context)
    {
        _dbContext = context;
    }

   [HttpGet]
//[Authorize]
public IActionResult Get()
{
    return Ok(_dbContext.Bikes.Include(b => b.Owner).ToList());
}
[HttpGet("{id}")]
[Authorize]
public IActionResult GetById(int id)
{
    Bike bike = _dbContext
        .Bikes
        .Include(b => b.Owner)
        .Include(b => b.BikeType)
        .Include(b => b.WorkOrders)
        .SingleOrDefault(b => b.Id == id);

    if (bike == null)
    {
        return NotFound();
    }

    return Ok(bike);
}



    [HttpGet("inventory")]
[Authorize]
public IActionResult Inventory()
{
    int inventory = _dbContext
    .Bikes
    .Where(b => b.WorkOrders.Any(wo => wo.DateCompleted == null))
    .Count();

    return Ok(inventory);
}
}